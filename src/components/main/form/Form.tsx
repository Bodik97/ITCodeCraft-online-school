declare global {
    interface Window {
        dataLayer?: any[];
        LEELOO_INIT_CHECK?: boolean;
        LEELOO_LEADGENTOOLS?: string[];
        itccTrack?: (
            event: string,
            label?: string,
            opts?: { skipThrottle?: boolean },
        ) => void;
        __itccRegistrationClicks?: number;
        productName?: string;
    }
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useRef } from 'react';
import { getFormSchema } from './schema';
import { useUserInfoStore } from '@/store/useUserInfoStore.ts';
import { cn, pushGtmEvent, uid } from '@/lib/utils';


import { reportError } from '@/lib/reportError';

import Inputs from './inputs/Inputs';

interface InputField {
    name: string;
    type: string;
    required?: boolean;
    [key: string]: any;
}

interface FormFields {
    inputs: InputField[];
    ctaPrimary: string;
    ctaSecondary: string;
}

export interface CrmParams {
    product_name: string;
    product_id: string;
    isModalForm?: boolean;
    redirectUrl?: string;
    formId: string;
}

interface FormConfigProps {
    formFields: FormFields;
    crmParams: CrmParams;
    afterSendFunction?: (data: any) => Promise<void>;
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLFKEM6U9mmi-WH7-yE61G99VVRHlIpFWWa6TtivbgLmdwjuji-swmE7Rkz7TO0ZLUMA/exec';

// for testing
// const GOOGLE_SCRIPT_URL = 'https://sfDOXUfpyHCrDuGzfGmGGA5Q1JKdtPr7WuJN3546pu7EF1LW7CN3kenWcjA/exec';

export default function FormComponent({
    formFields,
    crmParams,
    afterSendFunction = async (_data: any) => { },
}: FormConfigProps) {
    const { userInfo } = useUserInfoStore();
    const [country, setCountry] = useState(userInfo.country_code);

    useEffect(() => {
        setCountry(userInfo.country_code || 'UA');
    }, [userInfo.country_code]);



    const {
        product_name,
        redirectUrl,
    } = crmParams;

    const formSchema = getFormSchema(formFields.inputs, country);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        getValues,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(formSchema)
    });

    const progressDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        const sub = watch((value) => {
            if (progressDebounceRef.current) {
                clearTimeout(progressDebounceRef.current);
            }
            progressDebounceRef.current = setTimeout(() => {
                const entries = formFields.inputs
                    .map((f: InputField) => {
                        const raw = value[f.name];
                        const str =
                            raw === undefined || raw === null ? '' : String(raw);
                        return (
                            f.name +
                            '=' +
                            (str.length > 120 ? str.slice(0, 120) + '…' : str)
                        );
                    })
                    .join(' | ');
                const hasAny = formFields.inputs.some((f: InputField) => {
                    const raw = value[f.name];
                    if (raw === undefined || raw === null) return false;
                    return String(raw).trim().length > 0;
                });
                if (!hasAny) return;
                const ctx = crmParams.isModalForm ? 'модалка' : 'блок_на_сайті';
                const productHint =
                    typeof window !== 'undefined' && window.productName
                        ? window.productName
                        : crmParams.isModalForm
                          ? '—'
                          : 'сторінка_реєстрації';
                window.itccTrack?.(
                    'form_fill_progress',
                    `${ctx} | курс: ${productHint} | ${entries}`,
                    { skipThrottle: true },
                );
            }, 1500);
        });
        return () => {
            sub.unsubscribe();
            if (progressDebounceRef.current) {
                clearTimeout(progressDebounceRef.current);
            }
        };
    }, [watch, formFields.inputs, crmParams.isModalForm]);

    const onSubmit = async (formData: Record<string, any>) => {
        const resolvedProductName =
            typeof window !== 'undefined' && (window as { productName?: string }).productName != null
                ? (window as { productName?: string }).productName
                : product_name;

        const trackCtx = crmParams.isModalForm ? 'модалка' : 'блок_на_сайті';
        const leadSummary = JSON.stringify({
            context: trackCtx,
            course: resolvedProductName || 'Консультація',
            ...formData,
        });
        window.itccTrack?.('form_submit_lead', leadSummary, { skipThrottle: true });

        const sendData: Record<string, any> = {
            Course: resolvedProductName || "Консультація",
            FormID: crmParams.formId,

            ...formData,
        };

        try {
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(sendData),
                keepalive: true,
            });

            const mergedData = {
                ...sendData,
            };

            await pushGtmEvent('lead', {
                phone: mergedData.phone,
                email: mergedData.email,
                conversionId: uid(),
            });


            if (afterSendFunction) {
                await afterSendFunction(mergedData);
            }

            const params = new URLSearchParams(window.location.search);
            params.set('first_name', mergedData.name || '');
            params.set('phone', mergedData.phone || '');
            params.set('email', mergedData.email || '');

            if (redirectUrl) {
                reset();
                window.location.href = `${crmParams.redirectUrl}?${params.toString()}`;
            } else {
                window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
                if (crmParams.isModalForm) {
                    const modal = document.querySelector('.modal');
                    if (modal) {
                        modal.classList.add('opacity-0');
                        modal.classList.add('pointer-events-none');
                    }
                }

                document.dispatchEvent(new CustomEvent('itcc:form-success'));


            }


            return;



        } catch (error) {

            reportError('Error submitting form:', formData);
            document.dispatchEvent(new CustomEvent('itcc:form-error'));

        } finally {
            reset();
        }
    };

    return (
        <div className="relative">
            {!isSubmitting && (
                <form
                    id={crmParams.formId}
                    className={cn(' grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8')}
                    data-itcc-form="register-lead"
                    data-form-id={crmParams.formId}
                    noValidate
                    autoComplete="on"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {formFields.inputs.map((fields: any, index: number) => (
                        <Inputs
                            key={index}
                            {...fields}
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            country={country}
                            getValues={getValues}
                            setCountry={setCountry}
                            control={control}
                        />
                    ))}
                    <button

                        className={cn('form-btn group relative px-4 py-4 bg-neon-cyan text-white font-bold text-base rounded-xl shadow-neon-cyan hover:scale-[1.03] transition-transform duration-200 overflow-hidden w-full sm:w-auto xl:px-1 xl:rounded-none ')}
                        type="submit"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting}
                        aria-disabled={isSubmitting}
                    >
                        <span className="relative z-10 flex flex-col items-center">
                            <span className="flex items-center gap-2 xl:gap-1">
                                {formFields.ctaPrimary}
                                <span aria-hidden="true">→</span>
                            </span>

                        </span>
                        <div
                            className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                        >
                        </div>
                    </button>
                </form>
            )}

            {isSubmitting && (
                <div className="form-submit-spinner flex flex-col items-center justify-center gap-4 py-8">
                    <div className="form-spinner" aria-hidden="true" />
                    <p className="text-slate-500 text-sm font-medium">{'Надсилання даних...'}</p>
                </div>
            )}


        </div>
    );
}