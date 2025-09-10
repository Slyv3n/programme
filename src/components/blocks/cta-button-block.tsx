"use client"

import { cn } from "@/lib/utils"
import type { Block } from "@/types/block"
import { Button } from "../ui/button"
import Link from "next/link"
import { useKioskNavigation } from "@/hooks/use-kiosk-navigation"

interface CtaButtonBlockProps {
    block: Block
    isEditMode?: boolean
}

export function CtaButtonBlock({ block, isEditMode }: CtaButtonBlockProps) {
    const { text, link, variant = "default", size = "default", alignment = "center" } = block.content || {}
    const { buildUrl } = useKioskNavigation();

    const content = (
        <div
            className={cn(
                "px-6 py-8",
                alignment === "center" && "text-center",
                alignment === "left" && "text-left",
                alignment === "right" && "text-right",
                isEditMode && "border-2 border-dashed border-primary/50 flex items-center justify-center min-h-[100px]"
            )}
        >
            <Button className="font-semibold" size={size as any} variant={variant as any}>
                {text || "Bouton d'action"}
            </Button>
        </div>
    )

    if (link && !isEditMode) {
        return <Link href={buildUrl(link)}>{content}</Link>
    }

    return content
}