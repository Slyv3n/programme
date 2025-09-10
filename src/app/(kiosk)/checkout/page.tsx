'use client';

import { PromoCodeInput } from "@/components/checkout/PromoCodeInput";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useKioskNavigation } from "@/hooks/use-kiosk-navigation";
import { CartItem, useCartStore } from "@/store/cart-store";
import { useUserStore } from "@/store/user-store";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const DisplayOptions = ({ item }: { item: CartItem }) => {
    const optionsList = Object.values(item.selectedOptions || {}).flat();
    const ingredientsList = Object.values(item.selectedIngredients || {});

    if (optionsList.length === 0 && ingredientsList.length === 0) return null;

    const optionsText = optionsList.map(opt => {
        const subOptionText = opt.selectedSubOption ? ` (${opt.selectedSubOption.name})` : '';
        return `${opt.option.name}${subOptionText} (x${opt.quantity})`;
    }).join(', ');

    const allIngredients = item.product.ingredientGroups?.flatMap(g => g.items) || [];
    const ingredientsText = Object.entries(item.selectedIngredients || {})
        .map(([id, status]) => {
            const ing = allIngredients.find(i => i.id.toString() === id);
            if (!ing) return '';
            if (status === 'removed') return `sans ${ing.name}`;
            if (status === 'added') return `avec ${ing.name} (Suppl.)`;
            return '';
        }).filter(Boolean).join(', ');

    const fullText = [optionsText, ingredientsText].filter(Boolean).join('; ');
    if (!fullText) return null;

    return (
        <p className="pl-4 text-gray-500 text-sm" title={fullText}>
            {fullText}
        </p>
    );
}

const ProcessingOverlay = ({ message }: { message: string }) => (
    <div className="absolute backdrop-blur-sm bg-white/80 flex flex-col inset-0 items-center justify-center rounded-lg z-50">
        <Loader2 className="animate-spin h-16 mb-6 text-primary w-16" />
        <p className="font-semibold text-2xl text-gray-700">{message}</p>
    </div>
);

export default function CheckoutPage() {
    const { items, grandTotal, subtotal, discount, clearCart, hasBag, toggleBag } = useCartStore();
    const router = useRouter();
    const { user, logout } = useUserStore();
    const { navigate } = useKioskNavigation();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('');
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        if (!isExiting && items.length === 0 && !isDialogOpen) {
            router.push('/menu');
        }
    }, [items, router, isDialogOpen, isExiting]);

    const handleConfirmAndExit = useCallback(() => {
        setIsExiting(true);
        clearCart();
        logout();
        navigate("/");
    }, [clearCart, logout, navigate]);

    useEffect(() => {
        if (isDialogOpen) {
            const timer = setTimeout(() => {
                handleConfirmAndExit();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [isDialogOpen, handleConfirmAndExit]);

    const processOrder = async (userId: number | null) => {
        setIsProcessing(true);
        try {
            setProcessingMessage("Enregistrement de la commande...");

            await new Promise(resolve => setTimeout(resolve, 1000));

            const createResponse = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, grandTotal: grandTotal(), userId, orderType: useCartStore.getState().orderType }),
            });

            if (!createResponse.ok) throw new Error("La création de la commande a échoué.");

            setIsDialogOpen(true);
        } catch (error) {
            console.error(error);
            alert("Une erreur est survenue. Votre commande n'a pas pu être finalisée.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentClick = () => {
        processOrder(user?.id || null);
    };

    if (items.length === 0 && !isExiting) {
        return <p className="p-8 text-center">Votre panier est vide, redirection...</p>;
    }

    return (
        <>
            <div className="relative">
                {isProcessing && <ProcessingOverlay message={processingMessage} />}
                <div className={`transition-all ${isProcessing ? 'blur-sm pointer-events-none' : ''}`}>
                    <div className="max-w-4xl mx-auto p-4 sm:p-8">
                        <h1 className="font-bold mb-6 text-3xl text-gray-800">Récapitulatif de votre commande</h1>

                        <div className="bg-white divide-y divide-gray-200 p-6 rounded-lg shadow-md">
                            {items.map(item => (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center py-4" key={item.cartItemId}>
                                    <div className="flex items-center w-full sm:w-3/5">
                                        <Image
                                            alt={item.product.name}
                                            className="object-cover rounded-lg"
                                            height={80}
                                            src={item.product.imageUrl || ""}
                                            width={80}
                                        />
                                        <div className="ml-4">
                                            <p className="font-bold text-gray-800 text-lg">{item.product.name}</p>
                                            <DisplayOptions item={item} />
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:mt-0 text-left sm:text-center w-full sm:w-1/5">
                                        <span className="font-bold sm:hidden">Quantité : </span>
                                        <span className="font-semibold text-lg">{item.quantity}</span>
                                    </div>
                                    <div className="mt-2 sm:mt-0 text-left sm:text-right w-full sm:w-1/5">
                                        <span className="font-bold sm:hidden">Prix : </span>
                                        <span className="font-bold text-gray-800 text-lg">
                                            {(item.totalPrice * item.quantity).toFixed(2)} €
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-gray-50 mt-8 p-6 rounded-lg space-y-3">
                            <div className="flex justify-between text-lg text-gray-700">
                                <span>Sous-total</span>
                                <span>{subtotal().toFixed(2)} €</span>
                            </div>
                            {discount() > 0 && (
                                <div className="flex justify-between text-green-600 text-lg">
                                    <span>Réduction</span>
                                    <span>- {discount().toFixed(2)} €</span>
                                </div>
                            )}
                            <div className="border-t flex items-center justify-between pt-3 text-gray-700 text-lg">
                                <Label className="font-medium" htmlFor="plastic-bag">
                                    Ajouter un sac (+0.15€)
                                </Label>
                                <Switch
                                    checked={hasBag}
                                    id="plastic-bag"
                                    onCheckedChange={toggleBag}
                                />
                            </div>
                            <div className="border-t flex font-bold items-center justify-between pt-3 text-2xl text-gray-800">
                                <span>TOTAL À PAYER</span>
                                <span>{grandTotal().toFixed(2)} €</span>
                            </div>
                        </div>

                        <PromoCodeInput />

                        <div className="flex justify-end mt-8">
                            <Button
                                className="px-12 py-6 text-xl"
                                disabled={isProcessing}
                                onClick={handlePaymentClick}
                                size="lg"
                            >
                                Payer {grandTotal().toFixed(2)} €
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <AlertDialog open={isDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-2xl text-center">Paiement Réussi !</AlertDialogTitle>
                        <AlertDialogDescription className="pt-2 text-center text-lg">
                            Votre commande est en cours de préparation.
                            <br />
                            Vous allez être redirigé vers l&apos;accueil...
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}