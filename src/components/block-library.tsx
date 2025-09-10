"use client"

import { cn } from "@/lib/utils"
import { Columns, Grid3X3, ImageIcon, MousePointer, Plus, Search, Type } from "lucide-react"
import { Input } from "./ui/input"
import { useState } from "react"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface BlockType {
    id: string
    name: string
    description: string
    category: "content" | "layout" | "media" | "interactive"
    icon: React.ComponentType<{ className?: string }>
    preview?: string
}

const blockTypes: BlockType[] = [
    {
        id: "hero",
        name: "Hero Section",
        description: "Section d'en-tête avec titre, sous-titre et image de fond",
        category: "content",
        icon: ImageIcon,
        preview: "/abstract-hero-section.png",
    },
    {
        id: "text",
        name: "Bloc Texte",
        description: "Contenu textuel avec formatage riche",
        category: "content",
        icon: Type,
        preview: "/text-block.png",
    },
    {
        id: "ctaButton",
        name: "Bouton CTA",
        description: "Bouton d'appel à l'action personnalisable",
        category: "interactive",
        icon: MousePointer,
        preview: "/cta-button.jpg",
    },
    {
        id: "columnLayout",
        name: "Mise en page Colonnes",
        description: "Layout en colonnes pour organiser le contenu",
        category: "layout",
        icon: Columns,
        preview: "/column-layout.jpg",
    },
    {
        id: "productGrid",
        name: "Grille Produits",
        description: "Affichage en grille pour les produits",
        category: "content",
        icon: Grid3X3,
        preview: "/product-grid.png",
    },
    {
        id: "cartSummary",
        name: "Résumé Panier",
        description: "Affichage du panier avec articles et total, positionnable",
        category: "interactive",
        icon: Grid3X3,
    },
]

const categories = [
    { id: "all", name: "Tous", color: "default" },
    { id: "content", name: "Contenu", color: "blue" },
    { id: "layout", name: "Mise en page", color: "green" },
    { id: "media", name: "Média", color: "purple" },
    { id: "interactive", name: "Interactif", color: "orange" },
] as const

interface BlockLibraryProps {
    onAddBlock: (blockType: string) => void
    className?: string
}

export function BlockLibrary({ onAddBlock, className }: BlockLibraryProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredBlocks = blockTypes.filter((block) => {
        const matchesCategory = selectedCategory === "all" || block.category === selectedCategory
        const matchesSearch =
            block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            block.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className={cn("space-y-6", className)}>
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Bibliothèque de Blocs</h3>

                <div className="relative">
                    <Search className="absolute h-4 left-3 text-muted-foreground top-1/2 transform w-4 -translate-y-1/2" />
                    <Input
                        className="pl-10"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher des blocs..."
                        value={searchQuery}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Badge
                            className="cursor-pointer hover:bg-primary/80"
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            variant={selectedCategory === category.id ? "default" : "secondary"}
                        >
                            {category.name}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="gap-4 grid grid-cols-1">
                {filteredBlocks.map((block) => {
                    const IconComponent = block.icon
                    return (
                        <Card
                            className="cursor-pointer group hover:shadow-md transition-shadow"
                            key={block.id}
                            onClick={() => onAddBlock(block.id)}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2 items-center">
                                        <IconComponent className="h-5 text-primary w-5" />
                                        <CardTitle className="text-sm">{block.name}</CardTitle>
                                    </div>
                                    <Plus className="group-hover:text-primary h-4 text-muted-foreground transition-colors w-4" />
                                </div>
                                <CardDescription className="text-xs">{block.description}</CardDescription>
                            </CardHeader>
                            {block.preview && (
                                <CardContent className="pt-0">
                                    <div className="aspect-video bg-muted overflow-hidden rounded-md">
                                        <img
                                            alt={`Preview of ${block.name}`}
                                            className="h-full object-cover w-full"
                                            src={block.preview || "/placeholder.svg"}
                                        />
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    )
                })}
            </div>

            {filteredBlocks.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                    <Search className="h-8 mb-2 mx-auto opacity-50 w-8" />
                    <p>Aucun bloc trouvé</p>
                    <p className="text-sm">Essayez de modifier vos critères de recherche</p>
                </div>
            )}
        </div>
    )
}