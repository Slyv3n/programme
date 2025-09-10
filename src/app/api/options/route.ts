import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const newOption = await prisma.productOption.create({
            data: {
                name: data.name,
                priceModifier: data.priceModifier ? parseFloat(data.priceModifier) : null,
                optionGroupId: parseInt(data.optionGroupId),
            },
        });
        return NextResponse.json(newOption, { status: 201 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json({ error: "Une option avec ce nom existe déjà dans ce groupe." }, { status: 409 });
        }
        return NextResponse.json({ error: "Erreur lors de la création de l'option" }, { status: 500 });
    }
}