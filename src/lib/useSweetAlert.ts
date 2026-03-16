import { useCallback } from 'react';
import type React from 'react';

async function getSwal() {
    const [{ default: Swal }, { default: withReactContent }] = await Promise.all([
        import('sweetalert2'),
        import('sweetalert2-react-content'),
    ]);
    return withReactContent(Swal);
}

export const useSweetAlert = () => {
    const showSuccess = useCallback(
        async (successMessage?: string | React.ReactNode, autoClose: boolean = true) => {
            const MySwal = await getSwal();
            let timerInterval: ReturnType<typeof setInterval>;

            const options: Parameters<typeof MySwal.fire>[0] = {
                titleText: 'thanks',
                html: successMessage || 'reply',
                icon: 'success',
                iconColor: '#FF6C00',
                showCloseButton: true,
            };

            if (autoClose) {
                options.timer = 2000;
                options.timerProgressBar = true;
                options.didOpen = () => {
                    MySwal.showLoading();
                    timerInterval = setInterval(() => { }, 100);
                };
                options.willClose = () => {
                    clearInterval(timerInterval);
                };
            }

            MySwal.fire(options);
        },
        []
    );

    const showError = useCallback(
        async (errorMessage?: string | React.ReactNode, autoClose: boolean = true) => {
            const MySwal = await getSwal();
            let timerInterval: ReturnType<typeof setInterval>;

            const options: Parameters<typeof MySwal.fire>[0] = {
                titleText: 'error',
                html: errorMessage || 'tryAgain',
                icon: 'error',
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn',
                },
            };

            if (autoClose) {
                options.timer = 2000;
                options.timerProgressBar = true;
                options.didOpen = () => {
                    MySwal.showLoading();
                    timerInterval = setInterval(() => { }, 100);
                };
                options.willClose = () => {
                    clearInterval(timerInterval);
                };
            }

            MySwal.fire(options);
        },
        []
    );

    return { showSuccess, showError };
};