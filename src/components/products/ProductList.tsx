'use client';

import { ProductWithRelations } from "@/lib/prisma-types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductListProps {
    isHappyHourActive: boolean
    products: ProductWithRelations[]
    showPrices?: boolean
    showNames?: boolean
    showImages?: boolean
    columns?: number
}

export function ProductList({
    isHappyHourActive,
    products,
    showPrices,
    showNames,
    showImages,
    columns = 3,
}: ProductListProps) {
    if (products.length === 0) {
        return (
            <div className="p-10 text-center">
                <p className="text-lg text-muted-foreground">Aucun produit trouvé dans cette catégorie.</p>
            </div>
        );
    }

    const gridColsClass = `grid-cols-${columns}`;

    return (
        <div className={cn("gap-6 grid p-4", gridColsClass)}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    isHappyHourActive={isHappyHourActive}
                    product={product}
                    showPrices={showPrices}
                    showNames={showNames}
                    showImages={showImages}
                />
            ))}
        </div>
    );
}