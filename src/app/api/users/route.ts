import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { phone } = await request.json();
        if (!phone) {
            return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 });
        }

        let user = await prisma.user.findUnique({ where: { phone } });

        if (user && user.isBlacklisted) {
            return NextResponse.json({ error: "Ce numéro de téléphone a été blacklisté." }, { status: 403 });
        }

        if (!user) {
            user = await prisma.user.create({ data: { phone } });
        }

        return NextResponse.json(user);
    } catch {
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}