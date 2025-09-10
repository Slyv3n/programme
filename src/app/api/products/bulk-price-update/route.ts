import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { productIds, updateType, value } = await request.json();

        if (!productIds || productIds.length === 0 || !updateType || !value) {
            return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
        }

        const numericValue = parseFloat(value);

        if (updateType === 'percentage') {
            const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
            const updates = products.map(p =>
                prisma.product.update({
                    data: { price: p.price * (1 + numericValue / 100) },
                    where: { id: p.id },
                })
            );
            await prisma.$transaction(updates);
        }
        else if (updateType === 'fixed') {
            await prisma.product.updateMany({
                data: { price: { increment: numericValue } },
                where: { id: { in: productIds } },
            });
        }
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}