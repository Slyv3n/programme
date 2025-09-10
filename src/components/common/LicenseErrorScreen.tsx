'use client';

import { ShieldAlert } from "lucide-react";

export function LicenseErrorScreen({ error }: { error: string | null }) {
    return (
        <div className="bg-gray-100 flex flex-col h-screen items-center justify-center w-full">
            <ShieldAlert className="h-16 mb-4 text-red-500 w-16" />
            <h1 className="font-bold text-3xl text-gray-800">Licence Invalide</h1>
            <p className="mt-2 text-muted-foreground text-lg">{error || "Cette borne n'est pas autorisée à fonctionner."}</p>
        </div>
    );
}