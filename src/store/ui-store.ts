import { create } from "zustand";

interface UIState {
    isNavigating: boolean;
    startNavigation: () => void;
    stopNavigation: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isNavigating: false,
    startNavigation: () => set({ isNavigating: true }),
    stopNavigation: () => set({ isNavigating: false }),
}));