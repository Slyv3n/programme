"use client"

import { ProductWithRelations } from "@/lib/prisma-types";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useUserStore } from "@/store/user-store";
import { useKioskNavigation } from "@/hooks/use-kiosk-navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

const generateSimpleProductId = (productId: number) => `${productId}--`;

interface ProductCardProps {
    isHappyHourActive: boolean
    product: ProductWithRelations
    showPrices?: boolean
    showNames?: boolean
    showImages?: boolean
    showBorders?: boolean
    borderRadius?: string
    borderColor?: string
}

export function ProductCard({
    isHappyHourActive,
    product,
    showPrices = true,
    showNames = true,
    showImages = true,
    showBorders = true,
    borderRadius = 'rounded-lg',
    borderColor = 'border-gray-200',
}: ProductCardProps) {
    const { addItem, items } = useCartStore()
    const { user } = useUserStore()
    const { buildUrl, navigate } = useKioskNavigation()

    const productUrl = buildUrl(`/product/${product.id}`)
    const isAvailable = product.isAvailable ?? true
    const hasRequiredOptions = product.customizationOptionGroups?.some(
        group => (group.minChoices && group.minChoices > 0)
    )
    const isReward = !!(product.pointCost && product.pointCost > 0)
    const canAfford = user ? user.points >= (product.pointCost || 0) : false
    const simpleCartId = generateSimpleProductId(product.id)
    const itemInCart = items.find(item => item.cartItemId === simpleCartId)
    const isMaxQuantityReached = itemInCart ? itemInCart.quantity >= 10 : false

    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isAvailable || isMaxQuantityReached || (isReward && !canAfford)) {
            return;
        }

        if (hasRequiredOptions || isReward) {
            navigate(`/product/${product.id}`);
            return;
        }

        addItem(product);
    }

    const getButtonText = () => {
        if (!isAvailable) return "Épuisé";
        if (isReward) {
            if (!user) return "Connectez-vous";
            if (!canAfford) return "Points insuffisants";
        }
        if (isMaxQuantityReached) return "Quantité max";
        if (hasRequiredOptions) return "Personnaliser";
        return "Ajouter";
    }

    const hasNutritionalInfo = product.calories || product.allergens

    return (
        <Link
            aria-disabled={!isAvailable}
            className={cn(
                "block group p-4 relative transition-shadow",
                showBorders && "border shadow-md",
                borderRadius,
                borderColor,
            )}
            href={productUrl}
        >
            <div className={`transition-opacity ${!isAvailable ? 'grayscale opacity-40' : 'group-hover:shadow-xl'}`}>
                
                {!isAvailable && (
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-black bg-opacity-70 font-bold left-1/2 px-6 py-3 rotate-[-10deg] rounded-lg text-lg text-white top-1/2 z-20">
                        ÉPUISÉ
                    </div>
                )}

                {isHappyHourActive && !isReward && typeof product.happyHourPrice === 'number' && (
                    <div className="absolute bg-red-500 font-bold px-2 py-1 right-0 rounded-bl-lg rounded-tr-md text-white text-xs top-0">
                        HAPPY HOUR!
                    </div>
                )}

                {hasNutritionalInfo && isAvailable && (
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className="absolute bg-white/80 cursor-pointer left-2 p-1 rounded-full top-2 z-10"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <Info className="h-5 text-gray-600 w-5" />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <div className="p-1 space-y-1 text-sm">
                                    {product.calories && (
                                        <p><strong>Calories :</strong> {product.calories} kcal</p>
                                    )}
                                    {product.allergens && (
                                        <p><strong>Allergènes :</strong> {product.allergens}</p>
                                    )}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                <div className="flex flex-col items-center">
                    {showImages && (
                        <Image
                            alt={product.name}
                            className="object-cover rounded-md"
                            height={150}
                            quality={70}
                            src={product.imageUrl || '/images/placeholder.png'}
                            width={150}
                        />
                    )}
                    
                    {showNames && <h3 className="flex font-bold h-12 items-center mt-4 text-center text-lg">{product.name}</h3>}

                    {showPrices && (
                        <div className="font-semibold h-8 text-gray-800 text-xl">
                            {isReward ? (
                                <span className="font-bold text-yellow-500">{product.pointCost} points</span>
                            ) : isHappyHourActive && typeof product.happyHourPrice === 'number' ? (
                                <>
                                    <span className="text-red-500">{product.happyHourPrice.toFixed(2)} €</span>
                                    <span className="line-through ml-2 text-gray-400">{product.price.toFixed(2)} €</span>
                                </>
                            ) : (
                                <span>{product.price.toFixed(2)} €</span>
                            )}
                        </div>
                    )}
                
                    <Button
                        className="mt-4 z-10"
                        disabled={!isAvailable || isMaxQuantityReached || (isReward && !canAfford)} 
                        onClick={handleButtonClick}
                        variant={hasRequiredOptions || isReward ? "outline" : "default"}
                    >
                        {getButtonText()}
                    </Button>
                </div>
            </div>
        </Link>
    );
}