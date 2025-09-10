'use client';

import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="bg-gray-100 flex flex-col h-screen items-center justify-center p-4 text-center w-full">
            <ShieldAlert className="h-16 mb-4 text-red-500 w-16" />
            <h1 className="font-bold text-3xl text-gray-800">Une erreur est survenue</h1>
            <p className="mb-6 mt-2 text-lg text-muted-foreground">
                Impossible de se connecter au service. Veuillez réessayer dans un instant.
            </p>
            <Button onClick={() => reset()}>Réessayer</Button>
        </div>
    );
}