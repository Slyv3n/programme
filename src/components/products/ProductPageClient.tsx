'use client';

import { generateCartItemId, useCartStore } from "@/store/cart-store";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { IngredientCustomization } from "./IngredientCustomization";
import { ProductCustomization } from "./ProductCustomization";
import { Button } from "../ui/button";
import { ProductWithRelations } from "@/lib/prisma-types";
import { IngredientSelection, SelectedOptions } from "@/types";
import { useKioskNavigation } from "@/hooks/use-kiosk-navigation";
import { useUserStore } from "@/store/user-store";
import { ArrowLeft } from "lucide-react";

export function ProductPageClient({ product }: { product: ProductWithRelations }) {
    const { back, navigate } = useKioskNavigation();
    const { addItem, items } = useCartStore();
    const { user } = useUserStore();

    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
    const [selectedIngredients, setSelectedIngredients] = useState<IngredientSelection>({});
    const [isFormValid, setIsFormValid] = useState(false);

    const isAvailable = product.isAvailable ?? true;
    const isReward = !!(product.pointCost && product.pointCost > 0);
    const canAfford = user ? user.points >= (product.pointCost || 0) : false;

    useEffect(() => {
        let isValid = true;

        product.customizationOptionGroups?.forEach(group => {
            const minRequired = group.minChoices ?? 0;
            if (minRequired > 0) {
                const totalQuantity = (selectedOptions[group.id] || []).reduce((total, item) => total + item.quantity, 0);
                if (totalQuantity < minRequired) {
                    isValid = false;
                }
            }

            (selectedOptions[group.id] || []).forEach(item => {
                if (item.option.subOptions && item.option.subOptions.length > 0 && !item.selectedSubOption) {
                    isValid = false;
                }
            });
        });

        setIsFormValid(isValid);
    }, [selectedOptions, product]);

    const isMaxQuantityReached = useMemo(() => {
        const potentialCartItemId = generateCartItemId(product.id, selectedOptions, selectedIngredients);
        const itemInCart = items.find(item => item.cartItemId === potentialCartItemId);
        return itemInCart ? itemInCart.quantity >= 10 : false;
    }, [items, product.id, selectedOptions, selectedIngredients]);

    const calculateTotalPrice = () => {
        let price = isReward ? 0 : product.price;
        price += Object.values(selectedOptions)
            .flat()
            .reduce((total, opt) => total + (opt.option.priceModifier || 0) * opt.quantity, 0);
        product.ingredientGroups?.forEach(group => {
            group.items.forEach(ingredient => {
                if (selectedIngredients[ingredient.id] === 'added' && ingredient.addPrice) {
                    price += ingredient.addPrice;
                }
            });
        });
        return price;
    };

    const handleAddToCart = () => {
        if (!isFormValid || !isAvailable || isMaxQuantityReached || (isReward && !canAfford)) return;

        addItem(product, selectedOptions, selectedIngredients);
        navigate('/menu');
    };

    const getButtonText = () => {
        if (isReward) {
            if (!user) return "Connectez-vous";
            if (!canAfford) return "Points insuffisants";
        }
        if (isMaxQuantityReached) return "Quantité max atteinte";
        if (!isFormValid) return "Veuillez faire vos choix";
        return "Ajouter à la commande";
    };

    return (
        <main className="container md:p-8 mx-auto p-4 relative">
            <Button
                className="absolute flex gap-2 hover:text-foreground items-center left-4 md:left-8 md:top-8 text-lg text-muted-foreground top-4"
                variant="ghost" 
                onClick={back}
            >
                <ArrowLeft className="h-5 w-5" />
                Retour au menu
            </Button>

            <div className={`gap-8 grid md:pt-0 pt-16 ${product.imageUrl ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
                {product.imageUrl && (
                    <div className={`flex justify-center items-center ${!isAvailable ? 'grayscale' : ''}`}>
                        <Image alt={product.name} className="object-cover rounded-lg" height={500} src={product.imageUrl} width={500} />
                    </div>
                )}
            
                <div className="flex flex-col justify-center space-y-6">
                    <h1 className="font-bold text-4xl">{product.name}</h1>
                    {product.description && (<p className="text-gray-600 text-lg">{product.description}</p>)}
            
                    {!isAvailable ? (
                        <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                            <p className="font-bold">Produit actuellement indisponible</p>
                        </div>
                    ) : (
                        <>
                            {product.ingredientGroups && product.ingredientGroups.length > 0 && (
                                <IngredientCustomization
                                    groups={product.ingredientGroups}
                                    selection={selectedIngredients}
                                    onSelectionChange={setSelectedIngredients}
                                />
                            )}

                            {product.customizationOptionGroups && product.customizationOptionGroups.length > 0 && (
                                <ProductCustomization
                                    product={product}
                                    selectedOptions={selectedOptions}
                                    onSelectionChange={setSelectedOptions}
                                />
                            )}
                        
                            <div className="mt-8">
                                <div className="text-3xl font-extrabold text-orange-600 mb-6">
                                    {isReward ? (
                                        <span className="text-yellow-500">{product.pointCost} points</span>
                                    ) : (
                                        <span>Total : {calculateTotalPrice().toFixed(2)} €</span>
                                    )}
                                </div>
                                <Button 
                                    onClick={handleAddToCart} 
                                    size="lg" 
                                    disabled={!isFormValid || !isAvailable || isMaxQuantityReached || (isReward && !canAfford)}
                                    className="w-full max-w-sm"
                                >
                                    {getButtonText()}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}