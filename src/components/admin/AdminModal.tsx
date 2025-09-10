'use client';

import { useSettingsStore } from "@/store/settings-store";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ArrowLeft, Lock, Power, ShieldX, Wrench } from "lucide-react";
import Link from "next/link";

export function AdminModal() {
    const {
        isOrderingDisabled,
        isMenuVisible,
        hideAdminMenu,
        lockOrdering,
        unlockOrdering,
        checkAdminPassword,
    } = useSettingsStore();

    type View = 'closed' | 'pinpad' | 'menu';
    const [view, setView] = useState<View>('closed');
    
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (isOrderingDisabled) {
            setView('closed');
        } else if (isMenuVisible) {
            setView('pinpad');
        }
    }, [isOrderingDisabled, isMenuVisible]);

    const handleCloseAndReset = () => {
        hideAdminMenu();
        setPin('');
        setError(false);
    };

    const handlePinSubmit = () => {
        if (checkAdminPassword(pin)) {
            setView('menu');
            setPin('');
            setError(false);
        } else {
            setError(true);
            setPin('');
            setTimeout(() => setError(false), 800);
        }
    };

    const handlePinInput = (digit: string) => {
        if (pin.length < 4) setPin(pin + digit);
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
    };

    const renderClosedMessage = () => (
        <>
            <DialogHeader className="pt-4 space-y-4 text-center">
                <div className="bg-red-100 mb-2 mx-auto p-3 rounded-full w-fit">
                    <ShieldX className="h-10 text-red-500 w-10" />
                </div>
                <DialogTitle className="text-3xl">Commandes Suspendues</DialogTitle>
                <DialogDescription className="text-lg">
                    Nous sommes désolés, la prise de commande est temporairement indisponible.
                </DialogDescription>
            </DialogHeader>
            <div
                className="absolute bottom-0 h-20 left-0 w-20"
                onClick={() => setView('pinpad')}
            />
        </>
    );

    const renderPinPad = () => (
        <>
            <DialogHeader className="pt-4 space-y-2 text-center">
                <div className="bg-secondary mb-2 mx-auto p-3 rounded-full w-fit">
                    <Lock className="h-8 text-secondary-foreground w-8" />
                </div>
                <DialogTitle className="text-2xl">Accès Sécurisé</DialogTitle>
                <DialogDescription>Entrez le code PIN administrateur.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6 items-center py-4">
                <div className="flex gap-3 h-10 items-center">
                    {Array(4).fill(0).map((_, i) => (
                        <div
                            className={`duration-300 h-5 rounded-full transition-colors w-5 ${pin.length > i ? 'bg-primary' : 'bg-muted'}`}
                            key={i}
                        />
                    ))}
                </div>
                <div className="gap-4 grid grid-cols-3">
                    {'123456789'.split('').map(digit => (
                        <Button
                            className="font-bold h-16 rounded-full text-2xl w-16"
                            disabled={error}
                            key={digit}
                            onClick={() => handlePinInput(digit)}
                            variant="outline"
                        >
                            {digit}
                        </Button>
                    ))}
                    <Button
                        className="h-16 rounded-full w-16"
                        disabled={error}
                        onClick={handleDelete}
                        variant="ghost"
                    >
                        <ArrowLeft className="h-7 w-7" />
                    </Button>
                    <Button
                        className="font-bold h-16 rounded-full text-2xl w-16"
                        disabled={error}
                        onClick={() => handlePinInput('0')}
                        variant="outline"
                    >
                        0
                    </Button>
                    <Button
                        className="bg-green-500 h-16 hover:bg-green-600 rounded-full w-16"
                        disabled={error}
                        onClick={handlePinSubmit}
                    >
                        OK
                    </Button>
                </div>
                {!isOrderingDisabled && <Button onClick={handleCloseAndReset} size="sm" variant="link">Annuler</Button>}
            </div>
        </>
    );

    const renderAdminMenu = () => (
        <>
            <DialogHeader className="pt-4 space-y-2 text-center">
                <div className="bg-secondary mb-2 mx-auto p-3 rounded-full w-fit">
                    <Wrench className="h-8 text-secondary-foreground w-8" />
                </div>
                <DialogTitle className="text-2xl">Menu Administrateur</DialogTitle>
                <DialogDescription>État actuel : Commandes <span className={isOrderingDisabled ? 'font-bold text-red-500' : 'font-bold text-green-500'}>{isOrderingDisabled ? 'Désactivées' : 'Activées'}</span></DialogDescription>
            </DialogHeader>
            <div className="gap-4 grid grid-cols-1 py-4">
                {isOrderingDisabled ? (
                    <Button
                        className="bg-green-500 h-16 hover:bg-green-600 text-lg"
                        onClick={() => { unlockOrdering(); handleCloseAndReset(); }}
                        size="lg"
                        variant="default"
                    >
                        <Power className="h-5 mr-2 w-5" />
                        Réactiver les commandes
                    </Button>
                ) : (
                    <Button
                        className="h-16 text-lg"
                        onClick={() => { lockOrdering(); handleCloseAndReset(); }}
                        size="lg"
                        variant="destructive"
                    >
                        <Power className="h-5 mr-2 w-5" />
                        Suspendre les commandes
                    </Button>
                )}
                <Button
                    asChild
                    className="h-16 text-lg"
                    size="lg"
                    variant="outline"
                >
                    <Link href="/admin/products">Gérer les produits</Link>
                </Button>
                <Button
                    asChild
                    className="h-16 text-lg"
                    size="lg"
                    variant="outline"
                >
                    <Link href="/kitchen">Voir l&apos;écran cuisine</Link>
                </Button>
            </div>
            <div className="text-center">
                <Button
                    onClick={() => setView('pinpad')}
                    variant="link"
                >
                    Retour
                </Button>
            </div>
        </>
    );

    const renderContent = () => {
        switch(view) {
            case 'closed': return renderClosedMessage();
            case 'pinpad': return renderPinPad();
            case 'menu': return renderAdminMenu();
            default: return renderClosedMessage();
        }
    };

    return (
        <Dialog onOpenChange={(open) => !open && handleCloseAndReset()} open={isOrderingDisabled || isMenuVisible}>
            <DialogContent
                className={`duration-300 sm:max-w-md transition-transform ${error ? 'animate-shake' : ''}`}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                {renderContent()}
            </DialogContent>
        </Dialog>
    );
}