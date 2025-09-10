import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest
) {
    try {
        const data = await request.json();
        const newGroup = await prisma.optionGroup.create({
            data: {
                name: data.name,
                productId: parseInt(data.productId, 10),
                minChoices: parseInt(data.minChoices),
                maxChoices: parseInt(data.maxChoices),
                allowQuantity: data.allowQuantity,
                position: data.position ? parseInt(data.position) : null,
            },
        });
        return NextResponse.json(newGroup, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Erreur lors de la création du groupe" }, { status: 500 });
    }
}