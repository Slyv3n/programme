"use client"

import { useKioskNavigation } from "@/hooks/use-kiosk-navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Block } from "@prisma/client";
import { Home, ShoppingBag } from "lucide-react";

interface OrderTypeBlockProps {
    block: Block
    allBlocks?: Block[]
    isEditMode?: boolean
}

export function OrderTypeBlock({ block, isEditMode }: OrderTypeBlockProps) {
    const content = (block.content as any) || {}
    const config = {
        title: content.title || "Comment souhaitez-vous déguster ?",
        surPlaceText: content.surPlaceText || "Sur Place",
        surPlaceIcon: content.surPlaceIcon || "🏠",
        surPlaceColor: content.surPlaceColor || "text-orange-500",
        aEmporterText: content.aEmporterText || "À Emporter",
        aEmporterIcon: content.aEmporterIcon || "🛍️",
        aEmporterColor: content.aEmporterColor || "text-blue-600",
        backgroundColor: content.backgroundColor || "bg-gray-100",
        titleColor: content.titleColor || "text-gray-800",
    }

    const handleSelect = (type: "sur-place" | "a-emporter") => {
        if (isEditMode) return
        // const { navigate } = useKioskNavigation();
        // const { setOrderType } = useCartStore();
        // setOrderType(type)
        // navigate('/menu')
    }

    return (
        <div
            className={cn(config.backgroundColor, "flex flex-col items-center justify-center min-h-screen", {
                "pointer-events-none": isEditMode,
            })}
        >
            <h1 className={cn("font-bold mb-12 text-5xl", config.titleColor)}>{config.title}</h1>
            <div className="gap-8 grid grid-cols-1 md:grid-cols-2 max-w-4xl px-4 w-full">
                <div
                    className="bg-white cursor-pointer duration-300 hover:scale-105 p-12 rounded-lg shadow-lg text-center transform transition-transform"
                    onClick={() => handleSelect("sur-place")}
                >
                    <div className={cn("mb-4 text-6xl", config.surPlaceColor)}>{config.surPlaceIcon}</div>
                    <h2 className="font-bold text-4xl">{config.surPlaceText}</h2>
                </div>

                <div
                    className="bg-white cursor-pointer duration-300 hover:scale-105 p-12 rounded-lg shadow-lg text-center transform transition-transform"
                    onClick={() => handleSelect("a-emporter")}
                >
                    <div className={cn("mb-4 text-6xl", config.aEmporterColor)}>{config.aEmporterIcon}</div>
                    <h2 className="font-bold text-4xl">{config.aEmporterText}</h2>
                </div>
            </div>
        </div>
    )
}