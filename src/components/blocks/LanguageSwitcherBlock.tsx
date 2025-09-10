"use client"

import type { Block } from "@prisma/client";
import { Button } from "../ui/button";
import { useState } from "react";

interface LanguageSwitcherBlockProps {
    block: Block
    allBlocks?: Block[]
    isEditMode?: boolean
}

export function LanguageSwitcherBlock({ block, isEditMode }: LanguageSwitcherBlockProps) {
    const [currentLanguage, setCurrentLanguage] = useState<"fr" | "en">("fr")

    const changeLanguage = (lng: "fr" | "en") => {
        setCurrentLanguage(lng)
    }

    return (
        <div
            className={`${isEditMode ? "cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-opacity-50 relative" : ""}`}
            onClick={(e) => {
                if (isEditMode) {
                    e.preventDefault()
                    e.stopPropagation()
                    window.parent?.postMessage(
                        {
                            type: "EDIT_BLOCK",
                            blockId: block.id,
                        },
                        "*",
                    )
                }
            }}
        >
            {isEditMode && (
                <div className="absolute bg-blue-500 px-2 py-1 right-2 rounded text-white text-xs top-2 z-10">
                    🌐 Language Switcher
                </div>
            )}
            <div className="flex gap-2 items-center justify-center py-4">
                <Button onClick={() => changeLanguage("fr")} variant={currentLanguage === "fr" ? "secondary" : "ghost"}>
                    Français
                </Button>
                <Button onClick={() => changeLanguage("en")} variant={currentLanguage === "en" ? "secondary" : "ghost"}>
                    English
                </Button>
            </div>
        </div>
    )
}