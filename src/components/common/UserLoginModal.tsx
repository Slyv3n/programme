'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { User } from "@prisma/client";

interface UserLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

export function UserLoginModal({ isOpen, onClose, onLoginSuccess }: UserLoginModalProps) {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (phone.trim().length < 10) {
            setError("Veuillez entrer un numéro valide.");
            return;
        }
        setIsLoading(true);
        setError('');

        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: phone.trim() }),
        });

        setIsLoading(false);
        if (response.ok) {
            const user = await response.json();
            onLoginSuccess(user);
        } else {
            const errorData = await response.json();
            setError(errorData.error || "Une erreur est survenue.");
        }
    };

    return (
        <Dialog onOpenChange={onClose} open={isOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Compte Fidélité</DialogTitle>
                    <DialogDescription>Entrez votre numéro pour vous connecter.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Input
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Votre numéro de téléphone"
                        type="tel"
                        value={phone}
                    />
                    {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
                </div>
                <DialogFooter>
                    <Button disabled={isLoading} onClick={handleLogin}>
                        {isLoading && <Loader2 className="animate-spin h-4 mr-2 w-4" />}
                        {isLoading ? 'Connexion...' : 'Valider'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}