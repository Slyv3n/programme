import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const id = parseInt((await context.params).id);

        if (isNaN(id)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        await prisma.ingredientGroup.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch {
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}