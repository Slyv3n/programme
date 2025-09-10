import { ProductEditForm } from "@/components/admin/ProductEditForm";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getProductForAdmin(id: number) {
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
            customizationOptionGroups: {
                include: {
                    options: {
                        include: {
                            subOptions: true,
                        },
                    },
                },
            },
            ingredientGroups: {
                include: {
                    items: true,
                },
            },
        },
    });
    return product;
}

export default async function AdminProductDetailPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    if (isNaN(id)) return notFound();

    const product = await getProductForAdmin(id);
    if (!product) return notFound();

    return (
        <div className="container mx-auto py-10">
            <Button
                asChild
                className="mb-6"
                variant="outline"
            >
                <Link href={`/admin/products`}>← Retour à la liste</Link>
            </Button>
            <h1 className="font-bold mb-2 text-3xl">Modifier le Produit</h1>
            <p className="mb-6 text-muted-foreground">Vous modifiez {product.name}</p>

            <ProductEditForm product={product} />
        </div>
    );
}