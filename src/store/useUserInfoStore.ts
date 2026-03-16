import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserInfoType = {
    ip: string | null;
    country_code: string;
    country: string | null;
    city: string | null;
};

type UserInfoStore = {
    userInfo: UserInfoType;
    hasFetchedUserInfo: boolean;
    setUserInfo: (userInfo: UserInfoType) => void;
    fetchUserInfo: () => Promise<void>;
};

export const useUserInfoStore = create(
    persist<UserInfoStore>(
        (set, get) => ({
            userInfo: {
                ip: null,
                country_code: 'UA',
                country: null,
                city: null,
            },

            hasFetchedUserInfo: false,
            setUserInfo: (userInfo: UserInfoType) => set({ userInfo }),
            fetchUserInfo: async () => {
                if (get().hasFetchedUserInfo) return;

                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);
                    const response = await fetch('https://ipapi.co/json/', {
                        signal: controller.signal,
                    });
                    clearTimeout(timeoutId);
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const data = await response.json();
                    const { ip, country_code = 'UA', country, city } = data;

                    set({
                        userInfo: { ...data, ip, country_code, country, city },
                        hasFetchedUserInfo: true,
                    });
                } catch (error) {
                    console.error('Failed to fetch user info:', error);
                    set({
                        userInfo: {
                            ip: null,
                            country_code: 'UA',
                            country: null,
                            city: null,
                        },
                        hasFetchedUserInfo: true,
                    });
                }
            },
        }),
        {
            name: 'use-info-store',
            storage: createJSONStorage(() => localStorage),
        }
    )
);