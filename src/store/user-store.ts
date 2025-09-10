import { User } from "@prisma/client";
import { create } from "zustand";

interface UserState {
    login: (phone: string) => Promise<User | null>;
    logout: () => void;
    user: User | null;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    login: async (phone) => {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });
            if (!response.ok) throw new Error("Utilisateur non trouvé");
            const userData = await response.json();
            set({ user: userData });
            return userData;
        } catch {
            set({ user: null });
            return null;
        }
    },
    logout: () => set({ user: null }),
}));