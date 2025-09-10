"use client"

import { Block } from "@prisma/client"
import { AdminTriggerBlock } from "./blocks/AdminTriggerBlock"
import { ProductGridBlock } from "./blocks/ProductGridBlock"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { HeroBlock } from "./blocks/hero-block"
import { TextBlock } from "./blocks/text-block"
import { ColumnLayoutBlock } from "./blocks/column-layout-block"
import { CtaButtonBlock } from "./blocks/cta-button-block"
import { CartSummaryBlock } from "./blocks/CartSummaryBlock"

const blockComponents: { [key: string]: React.FC<any> } = {
    adminTrigger: AdminTriggerBlock,
    cartSummary: CartSummaryBlock,
    columnLayout: ColumnLayoutBlock,
    ctaButton: CtaButtonBlock,
    hero: HeroBlock,
    productGrid: ProductGridBlock,
    text: TextBlock,
}

export function PageRenderer({ blocks, allBlocks }: { blocks: Block[]; allBlocks?: Block[] }) {
    const searchParams = useSearchParams()
    const isEditMode = searchParams.get("edit_mode") === "true"

    if (!blocks || blocks.length === 0) return null

    const handleBlockClick = (blockId: number) => {
        if (isEditMode) {
            window.parent.postMessage({ type: "EDIT_BLOCK", blockId }, "*")
        }
    }

    return (
        <>
            {blocks
                .sort((a, b) => a.order - b.order)
                .map((block) => {
                    const BlockComponent = blockComponents[block.type]
                    if (!BlockComponent) return null

                    return (
                        <div
                            className={cn(isEditMode && "cursor-pointer hover:outline-blue-500 hover:outline-dashed")}
                            key={block.id}
                            onClick={() => handleBlockClick(block.id)}
                        >
                            <BlockComponent block={block} allBlocks={allBlocks || blocks} isEditMode={isEditMode} />
                        </div>
                    )
                })
            }
        </>
    )
}