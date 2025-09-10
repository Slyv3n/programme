import { auth } from "@/auth";
import { createProduct, getProductsForKiosk } from "@/lib/data";
import { triggerMenuUpdate } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await getProductsForKiosk();
        return NextResponse.json(products);
    } catch (error) {
        console.error("Erreur API GET /products:", error);
        return NextResponse.json({ error: "Erreur interne lors de la récupération des produits" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await auth();

    if (!session?.user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    try {
        const data = await request.json();
        const newProduct = await createProduct(data);

        await triggerMenuUpdate();

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message.includes("existe déjà")) {
                return NextResponse.json({ error: error.message }, { status: 409 });
            }
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Une erreur inattendue est survenue" }, { status: 500 });
    }
}