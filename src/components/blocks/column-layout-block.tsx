"use client"

import { cn } from "@/lib/utils"
import { PageRenderer } from "../page-renderer"
import type { Block } from "@prisma/client"

interface ColumnLayoutBlockProps {
    block: Block[]
    allBlocks: Block[]
    isEditMode?: boolean
}

export function ColumnLayoutBlock({ block, allBlocks, isEditMode }: ColumnLayoutBlockProps) {
    const { columns = 2, gap = "medium" } = (block.content as any) || {}

    const gapClasses = {
        small: "gap-4",
        medium: "gap-8",
        large: "gap-12",
    }

    const getColumnBlocks = (columnIndex: number) => {
        return allBlocks
            .filter((b) => b.parentId === block.id && b.column === `column-${columnIndex}`)
            .sort((a, b) => a.order - b.order)
    }

    return (
        <div className={cn(
            "px-6 py-8",
            isEditMode && "border-2 border-dashed border-primary/50 min-h-[200px]"
        )}>
            <div className={cn(
                "grid max-w-6xl mx-auto",
                columns === 2 && "grid-cols-1 md:grid-cols-2",
                columns === 3 && "grid-cols-1 md:grid-cols-3",
                columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
                gapClasses[gap as keyof typeof gapClasses],
            )}>
                {Array.from({ length: columns }, (_, index) => {
                    const columnBlocks = getColumnBlocks(index)

                    return (
                        <div
                            className={cn(
                                "min-h-[100px]",
                                isEditMode && "border border-dashed border-muted-foreground/30 p-4 rounded-lg",
                            )}
                            key={index}
                        >
                            {columnBlocks.length > 0 ? (
                                <PageRenderer blocks={columnBlocks} allBlocks={allBlocks} />
                            ) : (
                                isEditMode && (
                                    <div className="py-8 text-center text-muted-foreground">
                                        Colonne {index + 1}
                                        <br />
                                        <span className="text-sm">Glissez des blocs ici</span>
                                    </div>
                                )
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}