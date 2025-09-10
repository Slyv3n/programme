import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET() {
    try {
        const promoCodes = await prisma.promoCode.findMany({
            orderBy: { code: 'asc' },
        });
        return NextResponse.json(promoCodes);
    } catch {
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const newPromoCode = await prisma.promoCode.create({
            data: {
                code: data.code.toUpperCase(),
                discountType: data.discountType,
                value: parseFloat(data.value),
            },
        });
        return NextResponse.json(newPromoCode, { status: 201 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return NextResponse.json({ error: "Ce code promo existe déjà." }, { status: 409 });
        }
        return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }
}