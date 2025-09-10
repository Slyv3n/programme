"use client"

import type { Block } from "@prisma/client";
import { CartSummary } from "../cart/CartSummary";
import { cn } from "@/lib/utils";

interface CartSummaryBlockProps {
    block: Block
    allBlocks?: Block[]
    isEditMode?: boolean
}

export function CartSummaryBlock({ block, isEditMode }: CartSummaryBlockProps) {
    const config = (block.content as any) || {};

    const positionClasses = {
        fixed: "fixed right-0 top-0 z-40",
        inline: "relative",
    }

    const heightClasses = {
        full: "h-screen",
        auto: "h-auto",
    }

    const containerClasses = cn(
        "overflow-hidden",
        positionClasses[config.position as keyof typeof positionClasses] || positionClasses.inline,
        heightClasses[config.height as keyof typeof heightClasses] || heightClasses.auto,
        config.width || "w-full",
        config.backgroundColor || "bg-white",
        config.borderRadius || "rounded-lg",
        config.shadow && "shadow-lg",
    )

    if (isEditMode) {
        return (
            <div className={containerClasses}>
                <div className="bg-blue-100 border-b p-4 rounded-lg text-center">
                    <h3 className="font-bold text-blue-800">Bloc : Panier (Résumé)</h3>
                    <p className="text-blue-600 text-sm">Ce bloc affichera le vrai panier.</p>
                </div>
            </div>
        )
    }

    return (
        <div className={containerClasses}>
            <CartSummary />
        </div>
    )
}