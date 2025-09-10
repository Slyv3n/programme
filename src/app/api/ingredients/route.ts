import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const newIngredient = await prisma.ingredient.create({
            data: {
                name: data.name,
                isRemovable: data.isRemovable,
                addPrice: data.addPrice ? parseFloat(data.addPrice) : null,
                ingredientGroupId: parseInt(data.ingredientGroupId),
            },
        });
        return NextResponse.json(newIngredient, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Erreur lors de la création de l'ingrédient" }, { status: 500 });
    }
}