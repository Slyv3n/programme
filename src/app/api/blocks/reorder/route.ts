import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { orderedBlocks } = await request.json();

        const updateTransactions = orderedBlocks.map((block: { id: number; order: number; }) =>
            prisma.block.update({
                data: { order: block.order },
                where: { id: block.id },
            })
        );

        await prisma.$transaction(updateTransactions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Erreur lors de la réorganisation" }, { status: 500 });
    }
}