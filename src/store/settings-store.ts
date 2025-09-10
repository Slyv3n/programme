import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const ADMIN_PASSWORD = '2106';

interface SettingsState {
    isOrderingDisabled: boolean;
    isMenuVisible: boolean;
    inactivityTimeoutEnabled: boolean;
    _hasHydrated: boolean;

    setHasHydrated: (state: boolean) => void;
    showAdminMenu: () => void;
    hideAdminMenu: () => void;
    lockOrdering: () => void;
    unlockOrdering: () => void;
    checkAdminPassword: (password: string) => boolean;
    setInactivityTimeoutStatus: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            isOrderingDisabled: false,

            isMenuVisible: false,
            inactivityTimeoutEnabled: true,
            _hasHydrated: false,

            setHasHydrated: (state) => set({ _hasHydrated: state }),
            showAdminMenu: () => set({ isMenuVisible: true }),
            hideAdminMenu: () => set({ isMenuVisible: false }),
            lockOrdering: () => set({ isOrderingDisabled: true }),
            unlockOrdering: () => set({ isOrderingDisabled: false }),
            checkAdminPassword: (password) => password === ADMIN_PASSWORD,
            setInactivityTimeoutStatus: (enabled) => set({ inactivityTimeoutEnabled: enabled }),
        }),
        {
            name: 'kiosk-settings-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
            partialize: (state) => ({
                isOrderingDisabled: state.isOrderingDisabled,
            }),
        }
    )
);