import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const data = await request.json();
        const updatedGroup = await prisma.optionGroup.update({
            where: { id: parseInt(id) },
            data: {
                name: data.name,
                minChoices: parseInt(data.minChoices, 10),
                maxChoices: parseInt(data.maxChoices, 10),
                allowQuantity: data.allowQuantity,
                position: data.position ? parseInt(data.position) : null,
            },
        });
        return NextResponse.json(updatedGroup);
    } catch {
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await prisma.optionGroup.delete({ where: { id: parseInt(id) } });
        return new NextResponse(null, { status: 204 });
    } catch {
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}