declare global {
    interface Window {
        dataLayer?: any[];
        LEELOO_INIT_CHECK?: boolean;
        LEELOO_LEADGENTOOLS?: string[];
    }
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getFormSchema } from './schema';
import { useUserInfoStore } from '@/store/useUserInfoStore.ts';
import { cn, getGoogleIdFromGACookie, pushGtmEvent, uid } from '@/lib/utils';


import { useSweetAlert } from '@/lib/useSweetAlert';

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

}

interface FormConfigProps {
    formFields: FormFields;
    crmParams: CrmParams;
    afterSendFunction?: (data: any) => Promise<void>;
}

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwueBHdSPupfDOXUfpyHCrDuGzfGmGGA5Q1JKdtPr7WuJN3546pu7EF1LW7CN3kenWcjA/exec';

export default function FormComponent({
    formFields,
    crmParams,
    afterSendFunction = async (_data: any) => { },
}: FormConfigProps) {
    const { userInfo } = useUserInfoStore();
    const [country, setCountry] = useState(userInfo.country_code);
    const [siteUrl, setSiteUrl] = useState('');
    const { showError } = useSweetAlert();
    const [successSendModal, setSuccessSendModal] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            setSiteUrl(`${url.origin}${url.pathname}`);
        }
    }, []);

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
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (formData: Record<string, any>) => {
        const resolvedProductName =
            typeof window !== 'undefined' && (window as { productName?: string }).productName != null
                ? (window as { productName?: string }).productName
                : product_name;
        const sendData: Record<string, any> = {
            Course: resolvedProductName || "Консультація",
            leadActionSource: siteUrl,
            SiteURL: siteUrl,
            leadIP: userInfo.ip || null,
            leadUserAgent: window.navigator.userAgent,
            leadFBC: Cookies.get('_fbc') || null,
            leadFBP: Cookies.get('_fbp') || null,
            google_id: getGoogleIdFromGACookie(Cookies.get('_ga')),
            // product_name: resolvedProductName,

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
                console.log('Succes modal');
                setSuccessSendModal(true)

                document.dispatchEvent(new CustomEvent('itcc:form-success'));


            }


            return;



        } catch (error) {

            console.error('Error submitting form:', error);
            reportError('Error submitting form:', formData);

            showError('errorMessage');

        } finally {
            reset();
        }
    };

    return (
        <div className="relative">
            {!isSubmitting && (
                <form
                    className={cn(' grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-8')}
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