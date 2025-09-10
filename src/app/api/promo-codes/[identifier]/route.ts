import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ identifier: string }> }
) {
    try {
        const code = (await context.params).identifier.toUpperCase();
        const promoCode = await prisma.promoCode.findUnique({ where: { code } });

        if (promoCode) {
            return NextResponse.json(promoCode);
        } else {
            return new NextResponse('Code promo invalide', { status: 404 });
        }
    } catch {
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ identifier: string }> }
) {
    try {
        const id = parseInt((await context.params).identifier);

        if (isNaN(id)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        await prisma.promoCode.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch {
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}