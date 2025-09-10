import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: productId } = await context.params;

        const originalProduct = await prisma.product.findUnique({
            include: {
                customizationOptionGroups: { include: { options: { include: { subOptions: true } } } },
                ingredientGroups: { include: { items: true } },
            },
            where: { id: parseInt(productId) },
        });

        if (!originalProduct) {
            return NextResponse.json({ error: "Produit non trouvé" }, { status: 404 });
        }

        const baseCopyName = `${originalProduct.name} (copie)`;

        const existingCopiesCount = await prisma.product.count({
            where: {
                categoryId: originalProduct.categoryId,
                name: {
                    startsWith: baseCopyName,
                },
            }
        });

        let finalName = baseCopyName;
        if (existingCopiesCount > 0) {
            finalName = `${baseCopyName} ${existingCopiesCount + 1}`;
        }

        const duplicatedProduct = await prisma.product.create({
            data: {
                ...originalProduct,
                id: undefined,
                name: finalName,
                customizationOptionGroups: {
                    create: originalProduct.customizationOptionGroups.map(group => ({
                        ...group,
                        id: undefined,
                        productId: undefined,
                        options: {
                            create: group.options.map(option => ({
                                ...option,
                                id: undefined,
                                optionGroupId: undefined,
                                subOptions: {
                                    create: option.subOptions.map(subOption => ({
                                        ...subOption,
                                        id: undefined,
                                        optionId: undefined,
                                    })),
                                },
                            })),
                        },
                    })),
                },
                ingredientGroups: {
                    create: originalProduct.ingredientGroups.map(group => ({
                        ...group,
                        id: undefined,
                        productId: undefined,
                        items: {
                            create: group.items.map(item => ({
                                ...item,
                                id: undefined,
                                ingredientGroupId: undefined,
                            })),
                        },
                    })),
                },
            },
        });

        return NextResponse.json(duplicatedProduct, { status: 201 });
    } catch (error) {
        console.error("Erreur de duplication:", error);
        return NextResponse.json({ error: "Erreur lors de la duplication" }, { status: 500 });
    }
}