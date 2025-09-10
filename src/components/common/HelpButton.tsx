'use client';

import { useState } from "react";
import { Button } from "../ui/button";
import { HelpCircle } from "lucide-react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { usePathname, useSearchParams } from "next/navigation";

export function HelpButton() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [dialogOpen, setDialogOpen] = useState(false);

    const requestHelp = async () => {
        const kioskId = searchParams.get('kioskId') || 'Borne Inconnue';

        try {
            await fetch('/api/help', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: `Un client demande de l'aide à la "${kioskId.replace(/_/g, ' ')}"` })
            });
            setDialogOpen(true);
        } catch (error) {
            console.error("Impossible d'envoyer la demande d'aide", error);
        }
    };

    const isHidden = pathname.startsWith('/admin') || pathname.startsWith('/kitchen') || pathname.startsWith('/status');

    if (isHidden) return null;

    return (
        <>
            <Button
                className="border-2 bottom-4 fixed h-16 right-4 rounded-full shadow-lg w-16 z-50"
                onClick={requestHelp}
                variant="outline"
            >
                <HelpCircle className="h-8 w-8" />
            </Button>
            <AlertDialog onOpenChange={setDialogOpen} open={dialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Demande envoyée !</AlertDialogTitle>
                        <AlertDialogDescription>
                            Un membre de notre équipe arrive pour vous aider.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Fermer</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}