"use client"

import { cn } from "@/lib/utils"
import { Block } from "@/types/block"

interface HeroBlockProps {
    block: Block
    isEditMode?: boolean
}

export function HeroBlock({ block, isEditMode }: HeroBlockProps) {
    const { title, subtitle, backgroundImage, alignment = "center" } = (block.content as any) || {}

    return (
        <section
            className={cn(
                "flex items-center justify-center min-h-[400px] overflow-hidden relative",
                isEditMode && "border-2 border-dashed border-primary/50"
            )}
        >
            {backgroundImage && (
                <div
                    className="absolute bg-center bg-cover bg-no-repeat inset-0"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    <div className="absolute bg-black/40 inset-0" />
                </div>
            )}

            <div
                className={cn(
                    "max-w-4xl mx-auto px-6 relative text-center z-10",
                    alignment === "left" && "text-left",
                    alignment === "right" && "text-right",
                )}
            >
                {title && <h1 className="font-bold mb-4 text-4xl md:text-6xl text-balance text-white">{title}</h1>}
                {subtitle && <p className="text-xl md:text-2xl text-pretty text-white/90">{subtitle}</p>}
            </div>
        </section>
    )
}