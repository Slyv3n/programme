import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const { content } = await request.json();

        const updatedBlock = await prisma.block.update({
            data: { content },
            where: { id },
        })

        return NextResponse.json(updatedBlock)
    } catch {
        return NextResponse.json({ error: "Failed to update block" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const blockId = Number.parseInt(params.id)

        await prisma.block.delete({
            where: { id: blockId },
        })

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: "Failed to delete block" }, { status: 500 })
    }
}