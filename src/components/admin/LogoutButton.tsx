'use client';

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
    return (
        <Button
            onClick={() => signOut({ callbackUrl: '/login' })}
            size="sm"
            variant="ghost"
        >
            <LogOut className="h-4 mr-2 w-4" />
            Déconnexion
        </Button>
    );
}