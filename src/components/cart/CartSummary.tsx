'use client';

import { CartItem, useCartStore } from "@/store/cart-store";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useKioskNavigation } from "@/hooks/use-kiosk-navigation";

const DisplayOptions = ({ item }: { item: CartItem }) => {
    const optionsList = Object.values(item.selectedOptions || {}).flat();
    if (optionsList.length === 0) return null;

    const optionsText = optionsList.map(opt => {
        const subOptionText = opt.selectedSubOption ? ` (${opt.selectedSubOption.name})` : '';
        return `${opt.option.name}${subOptionText} (x${opt.quantity})`;
    }).join(', ');
    
    return (
        <p className="text-gray-500 text-xs truncate" title={optionsText}>
            {optionsText}
        </p>
    );
};

const DisplayIngredients = ({ item }: { item: CartItem }) => {
    const modifications = item.selectedIngredients || {};
    const modificationKeys = Object.keys(modifications);

    if (modificationKeys.length === 0) return null;

    const allIngredients = item.product.ingredientGroups?.flatMap(g => g.items) || [];
    const ingredientsText = modificationKeys.map(ingredientId => {
        const ingredient = allIngredients.find(ing => ing.id.toString() === ingredientId);
        if (!ingredient) return null;

        const status = modifications[ingredientId];
        if (status === 'removed') return `sans ${ingredient.name}`;
        if (status === 'added') return `avec ${ingredient.name} (Suppl.)`;
        return null;
    }).filter(Boolean).join(', ');

    if (!ingredientsText) return null;

    return (
        <p className="text-blue-600 text-xs truncate" title={ingredientsText}>
            {ingredientsText}
        </p>
    );
};

export function CartSummary() {
    const {
        items,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        grandTotal,
        appliedCode,
        orderType
    } = useCartStore();

    const { buildUrl } = useKioskNavigation();

    if (items.length === 0) {
        return (
            <div className="flex flex-col h-full">
                {orderType && (
                    <div className="bg-blue-100 font-bold p-3 text-blue-800 text-center text-lg">
                        {orderType === 'sur-place' ? 'Commande Sur Place' : 'Commande À Emporter'}
                    </div>
                )}
                <div className="flex flex-grow items-center justify-center p-4 text-center text-gray-500">
                    <p>Votre panier est vide.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {orderType && (
                <div className="bg-blue-100 font-bold p-3 text-blue-800 text-center text-lg">
                    {orderType === 'sur-place' ? 'Commande Sur Place' : 'Commande À Emporter'}
                </div>
            )}

            <div className="flex-grow overflow-y-auto p-4">
                {items.map((item) => (
                    <div className="border-b flex items-center justify-between mb-4 pb-2" key={item.cartItemId}>
                        <Image
                            alt={item.product.name}
                            className="object-cover rounded-md"
                            height={50}
                            src={item.product.imageUrl || ""}
                            width={50}
                        />
                        <div className="flex-grow px-3">
                            <p className="font-bold">{item.product.name}</p>
                            <DisplayOptions item={item} />
                            <DisplayIngredients item={item} />
                            <p className="font-semibold text-gray-700 text-sm">{item.totalPrice.toFixed(2)} €</p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <button
                                className="border flex font-bold h-7 hover:bg-gray-100 items-center justify-center rounded-full text-lg transition w-7"
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            >
                                -
                            </button>
                            <span className="font-bold">{item.quantity}</span>
                            <button
                                className="border disabled:cursor-not-allowed disabled:opacity-50 flex font-bold h-7 hover:bg-gray-100 items-center justify-center rounded-full text-lg transition w-7"
                                disabled={item.quantity >= 10}
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                    <span>Sous-total</span>
                    <span>{subtotal().toFixed(2)} €</span>
                </div>

                {appliedCode && (
                    <div className="flex font-semibold justify-between text-green-600">
                        <span>Réduction ({appliedCode.code})</span>
                        <span>- {discount().toFixed(2)} €</span>
                    </div>
                )}

                <div className="border-t flex font-bold justify-between mt-2 pt-2 text-xl">
                    <span>Total</span>
                    <span>{grandTotal().toFixed(2)} €</span>
                </div>

                <div className="pt-2">
                    <Button
                        asChild
                        className="w-full"
                    >
                        <Link href={buildUrl('/checkout')}>Valider et Payer</Link>
                    </Button>

                    <Button
                        className="hover:text-red-600 mt-2 text-red-500 w-full"
                        onClick={clearCart}
                        variant="ghost"
                    >
                        Vider le panier
                    </Button>
                </div>
            </div>
        </div>
    );
}