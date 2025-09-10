import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json({ error: "Le statut est requis" }, { status: 400 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status },
        });

        return NextResponse.json(updatedOrder);
    } catch {
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}