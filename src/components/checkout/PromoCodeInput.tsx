'use client';

import { useCartStore } from "@/store/cart-store";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function PromoCodeInput() {
    const { applyPromoCode, removePromoCode, appliedCode } = useCartStore();
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleApplyCode = async () => {
        if (!inputValue) return;
        setIsLoading(true);
        setError('');
        const success = await applyPromoCode(inputValue);
        if (!success) {
            setError('Ce code promo est invalide ou a expiré.');
        } else {
            setInputValue('');
        }
        setIsLoading(false);
    }

    if (appliedCode) {
        return (
            <div className="mt-6">
                <p className="font-semibold text-green-600">
                    Code {appliedCode.code} appliqué !
                </p>
                <Button
                    className="h-auto p-0 text-red-500"
                    onClick={removePromoCode}
                    variant="link"
                >
                    Supprimer
                </Button>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <label className="font-semibold text-gray-700" htmlFor="promo">Avez-vous un code promo ?</label>
            <div className="flex items-center mt-2">
                <Input
                    className="rounded-r-none"
                    disabled={isLoading}
                    id="promo"
                    onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                    placeholder="Entrez votre code"
                    type="text"
                    value={inputValue}
                />
                <Button
                    className="rounded-l-none"
                    disabled={isLoading}
                    onClick={handleApplyCode}
                >
                    {isLoading ? '...' : 'Appliquer'}
                </Button>
            </div>
            {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
        </div>
    );
}