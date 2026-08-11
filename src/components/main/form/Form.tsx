import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useRef } from 'react';
import { getFormSchema } from './schema';
import { useUserInfoStore } from '@/store/useUserInfoStore.ts';
import { cn, pushGtmEvent, uid } from '@/lib/utils';


import { dispatchFormError, dispatchFormSuccess } from '@/lib/formEvents';
import { reportError, reportLeadSuccess } from '@/lib/reportError';
import {
  buildGoogleSheetLeadPayload,
  submitLeadToGoogleSheet,
} from '@/lib/formSubmit';

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
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(formSchema)
    });

    // Honeypot input: hidden from users, commonly auto-filled by bots.
    const honeypotRef = useRef<HTMLInputElement>(null);

    const onSubmit = async (formData: Record<string, any>) => {
        // Bot trap: real users never fill the hidden honeypot. If it's set, silently
        // drop the submission (show success) without touching the lead endpoint.
        if (honeypotRef.current?.value) {
            reset();
            dispatchFormSuccess();
            return;
        }

        const resolvedProductName =
            typeof window !== 'undefined' && (window as { productName?: string }).productName != null
                ? (window as { productName?: string }).productName
                : product_name;

        const sendData = buildGoogleSheetLeadPayload({
            course: resolvedProductName || 'Консультація',
            formId: crmParams.formId,
            name: formData.name ?? '',
            phone: formData.phone ?? '',
            email: formData.email ?? '',
            childAge: formData.childAge ?? formData.child_age,
        });

        try {
            await submitLeadToGoogleSheet(sendData);

            const mergedData = {
                ...sendData,
            };

            void reportLeadSuccess({ formId: crmParams.formId, fields: formData });

            await pushGtmEvent('lead', {
                phone: mergedData.phone,
                email: mergedData.email,
                conversionId: uid(),
            });

            // GA4 lead conversion (recommended event) on the main property.
            window.gtag?.('event', 'generate_lead', {
                course: mergedData.Course,
                form_id: crmParams.formId,
            });

            // Meta Pixel lead conversion (no-op when pixel isn't loaded).
            window.fbq?.('track', 'Lead');


            if (afterSendFunction) {
                await afterSendFunction(mergedData);
            }

            const params = new URLSearchParams(window.location.search);
            params.set('first_name', mergedData.name || '');
            params.set('phone', mergedData.phone || '');
            params.set('email', mergedData.email || '');

            if (redirectUrl) {
                reset();
                const nextUrl = `${crmParams.redirectUrl}?${params.toString()}`;
                // Google Ads conversion — waits for the hit, then redirects.
                if (window.gtag_report_conversion) {
                    window.gtag_report_conversion(nextUrl);
                } else {
                    window.location.href = nextUrl;
                }
            } else {
                window.gtag_report_conversion?.();
                window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
                if (crmParams.isModalForm) {
                    const modal = document.querySelector('.modal');
                    if (modal) {
                        modal.classList.add('opacity-0');
                        modal.classList.add('pointer-events-none');
                    }
                }

                dispatchFormSuccess();


            }

            reset();

            return;



        } catch (error) {
            reportError(error, { formId: crmParams.formId, fields: formData });
            dispatchFormError();
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
                    <input
                        ref={honeypotRef}
                        type="text"
                        name="company_website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="absolute -left-[9999px] h-px w-px opacity-0"
                    />
                    {formFields.inputs.map((fields: any, index: number) => (
                        <Inputs
                            key={index}
                            {...fields}
                            register={register}
                            errors={errors}
                            country={country}
                            setCountry={setCountry}
                            control={control}
                        />
                    ))}
                    <button

                        className={cn('form-btn z-0 group relative px-4 py-4 font-bold text-base rounded-xl hover:scale-[1.03] transition-transform duration-200 overflow-hidden w-full sm:w-auto xl:px-1 xl:rounded-none ')}
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