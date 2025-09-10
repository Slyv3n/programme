import { cn } from "@/lib/utils";
import { Block } from "@/types/block";

interface TextBlockProps {
    block: Block
    isEditMode?: boolean
}

export function TextBlock({ block, isEditMode }: TextBlockProps) {
    const { title, content, alignment = "left", titleSize = "h2" } = (block.content as any) || {}

    const titleSizeClasses = {
        h1: "text-4xl font-bold",
        h2: "text-3xl font-bold",
        h3: "text-2xl font-semibold",
        h4: "text-xl font-semibold",
    }

    const sizeClasses = {
        small: "text-sm",
        medium: "text-base",
        large: "text-lg",
        xl: "text-xl",
    }

    return (
        <div className={cn(
            "px-6 py-8",
            isEditMode && "border-2 border-dashed border-primary/50 min-h-[100px]"
        )}>
            <div className={cn(
                "max-w-4xl mx-auto",
                alignment === "center" && "text-center",
                alignment === "right" && "text-right",
            )}>
                {title && <h2 className={cn("mb-4", titleSizeClasses[titleSize as keyof typeof titleSizeClasses])}>{title}</h2>}
                
                {content ? (
                    <div className="dark:prose-invert max-w-none prose prose-gray">
                        <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br>") }} />
                    </div>
                ) : (
                    <p className="text-muted-foreground">
                        {isEditMode ? "Cliquez pour éditer ce texte" : "Contenu du bloc texte"}
                    </p>
                )}
            </div>
        </div>
    )
}