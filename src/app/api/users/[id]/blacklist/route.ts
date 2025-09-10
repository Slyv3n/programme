import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const { isBlacklisted } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { isBlacklisted },
        });
        return NextResponse.json(updatedUser);
    } catch {
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}