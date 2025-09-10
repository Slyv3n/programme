import { deleteProduct, updateProduct } from '@/lib/data';
import { triggerMenuUpdate } from '@/lib/pusher';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const data = await request.json();
        const updatedProduct = await updateProduct(parseInt(id), data);

        await triggerMenuUpdate();

        return NextResponse.json(updatedProduct);
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json({ error: "Un autre produit avec ce nom existe déjà dans cette catégorie." }, { status: 409 });
        }
        return NextResponse.json({ error: "Erreur lors de la mise à jour du produit" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await deleteProduct(parseInt(id));

        await triggerMenuUpdate();

        return new NextResponse(null, { status: 204 });
    } catch {
        return NextResponse.json({ error: "Erreur lors de la suppression du produit" }, { status: 500 });
    }
}