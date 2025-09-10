'use client';

import { useUserStore } from "@/store/user-store";
import { Button } from "../ui/button";

export function UserLogin() {
    const { user, logout } = useUserStore();

    if (user) {
        return (
            <div className="text-center">
                <p>Connecté : {user.phone}</p>
                <p className="font-bold">{user.points} points</p>
                <Button onClick={logout} variant="link">Se déconnecter</Button>
            </div>
        );
    }

    return <Button>Mon Compte Fidélité</Button>;
}