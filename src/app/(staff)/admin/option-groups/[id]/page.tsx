import { OptionsManager } from "@/components/admin/forms/OptionsManager";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getGroupWithOptions(id: number) {
    const group = await prisma.optionGroup.findUnique({
        where: { id },
        include: {
            options: {
                include: {
                    subOptions: true,
                },
            },
        },
    });
    return group;
}

export default async function AdminOptionGroupPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id);
    if (isNaN(id)) return notFound();

    const group = await getGroupWithOptions(id);
    if (!group) return notFound();

    return (
        <div className="container mx-auto py-10">
            <Button asChild className="mb-6" variant="outline">
                <Link href={`/admin/products/${group.productId}`}>← Retour au produit</Link>
            </Button>
            <h1 className="font-bold text-3xl">Gestion du groupe {group.name}</h1>
            <p className="mb-6 text-muted-foreground">Ajoutez, modifiez ou supprimez les options disponibles dans ce groupe.</p>

            <OptionsManager group={group} />
        </div>
    );
}