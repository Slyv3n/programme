'use client';

import { ProductWithRelations } from "@/lib/prisma-types";
import { useCartStore } from "@/store/cart-store";
import { useState } from "react";

interface AddToCartButtonProps {
    product: ProductWithRelations;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCartStore();
    const [wasAdded, setWasAdded] = useState(false);

    const handleAddToCart = () => {
        addItem(product);
        setWasAdded(true);
        setTimeout(() => setWasAdded(false), 2000);
    };

    return (
        <button
            className={`font-bold max-w-sm px-6 py-3 rounded-lg text-lg text-white transition-colors w-full ${
                wasAdded
                    ? 'bg-blue-500'
                    : 'bg-green-500 hover:bg-green-600'
            }`}
            onClick={handleAddToCart}
        >
            {wasAdded ? 'Ajouté !' : 'Ajouter à la commande'}
        </button>
    );
}