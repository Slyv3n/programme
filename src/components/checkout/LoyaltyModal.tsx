'use client';

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2, Star } from "lucide-react";

interface LoyaltyModalProps {
    error?: string;
    isLoading?: boolean;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (phone: string | null) => void;
}

export function LoyaltyModal({ error, isLoading = false, isOpen, onClose, onConfirm }: LoyaltyModalProps) {
    const [step, setStep] = useState<'initial' | 'input'>('initial');
    const [phone, setPhone] = useState('');
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep('initial');
            setPhone('');
            setLocalError('');
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        if (phone.trim().length < 10) {
            setLocalError("Veuillez entrer un numéro de téléphone valide.");
            return;
        }
        setLocalError('');
        onConfirm(phone.trim());
    };

    const renderInitialStep = () => (
        <>
            <DialogHeader className="space-y-2 text-center">
                <div className="bg-yellow-100 mb-2 mx-auto p-3 rounded-full w-fit">
                    <Star className="h-8 text-yellow-500 w-8" />
                </div>
                <DialogTitle className="text-2xl">Programme de Fidélité</DialogTitle>
                <DialogDescription>
                    Cumulez des points avec cet achat et profitez de récompenses exclusives !
                </DialogDescription>
            </DialogHeader>
            <div className="gap-4 grid grid-cols-2 pt-4">
                <Button
                    className="h-16 text-lg"
                    onClick={() => onConfirm(null)}
                    size="lg"
                    variant="outline"
                >
                    Non, merci
                </Button>
                <Button
                    className="h-16 text-lg"
                    onClick={() => setStep('input')}
                    size="lg"
                >
                    Oui, avec plaisir !
                </Button>
            </div>
        </>
    );

    const renderInputStep = () => (
        <>
            <DialogHeader>
                <DialogTitle className="text-xl">Cumulez vos points</DialogTitle>
                <DialogDescription>
                    Entrez votre numéro de téléphone pour retrouver votre compte ou en créer un.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Input
                    className="h-12 text-lg"
                    disabled={isLoading}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Votre numéro de téléphone"
                    type="tel"
                    value={phone}
                />
                {(error || localError) && (
                    <p className="mt-2 text-red-500 text-sm">{error || localError}</p>
                )}
            </div>
            <DialogFooter className="sm:justify-between">
                <Button
                    disabled={isLoading}
                    onClick={() => setStep('initial')}
                    variant="ghost"
                >
                    Retour
                </Button>
                <Button
                    disabled={isLoading}
                    onClick={handleConfirm}
                >
                    {isLoading && <Loader2 className="animate-spin h-4 mr-2 w-4" />}
                    {isLoading ? 'Vérification...' : 'Valider le numéro'}
                </Button>
            </DialogFooter>
        </>
    );

    return (
        <Dialog onOpenChange={onClose} open={isOpen}>
            <DialogContent>
                {step === 'initial' ? renderInitialStep() : renderInputStep()}
            </DialogContent>
        </Dialog>
    );
}