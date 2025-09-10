import { generateLicenseKey } from "@/lib/license-utils";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { clientName, tierId, expiresAt } = await request.json();

        if (!clientName || !tierId) {
            return NextResponse.json({ error: "Nom du client et palier requis" }, { status: 400 });
        }

        const newKey = generateLicenseKey();

        const newLicense = await prisma.license.create({
            data: {
                id: newKey,
                clientName: clientName,
                isActive: true,
                tierId: parseInt(tierId),
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });

        return NextResponse.json(newLicense, { status: 201 });
    } catch (error) {
        console.error("Erreur de génération de licence:", error);
        return NextResponse.json({ error: "Erreur lors de la génération de la licence" }, { status: 500 });
    }
}