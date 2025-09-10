import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { productIds, isAvailable } = await request.json();

        if (!productIds || productIds.length === 0 || typeof isAvailable !== 'boolean') {
            return NextResponse.json({ error: "Données manquantes ou invalides" }, { status: 400 });
        }

        await prisma.product.updateMany({
            data: { isAvailable: isAvailable },
            where: { id: { in: productIds } },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erreur lors de la mise à jour du statut" }, { status: 500 });
    }
}