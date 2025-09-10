import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    /*const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }*/

    try {
        const { type, pageId, order, content } = await request.json()

        const block = await prisma.block.create({
            data: {
                type,
                pageId: Number.parseInt(pageId),
                order,
                content: content || {},
            },
        })

        return NextResponse.json(block)
    } catch {
        return NextResponse.json({ error: "Failed to create block" }, { status: 500 })
    }
}