'use client';

import { useUserStore } from "@/store/user-store";
import { LogOut, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { UserLoginModal } from "./UserLoginModal";

export function LoyaltyStatus() {
    const { user, login, logout } = useUserStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (user) {
        return (
            <div className="bg-yellow-50 border-b p-4 text-center">
                <p className="font-semibold text-gray-800">Bienvenue !</p>
                <div className="flex font-bold gap-2 items-center justify-center text-yellow-600 text-xl">
                    <Star className="h-5 w-5" />
                    <span>{user.points} points</span>
                </div>
                <Button
                    className="h-auto mt-1 p-0"
                    onClick={logout}
                    size="sm"
                    variant="link"
                >
                    <LogOut className="h-3 mr-1 w-3" />
                    Se déconnecter
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="border-b p-4">
                <Button
                    className="w-full"
                    onClick={() => setIsModalOpen(true)}
                >
                    Mon Compte Fidélité
                </Button>
            </div>
            <UserLoginModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onLoginSuccess={(user) => {
                    login(user.phone);
                    setIsModalOpen(false);
                }}
            />
        </>
    );
}