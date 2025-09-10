import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: kioskId } = await context.params;
        const { enabled } = await request.json();

        if (typeof enabled !== 'boolean') {
            return NextResponse.json({ error: "La propriété 'enabled' doit être un booléen." }, { status: 400 });
        }

        const updatedKiosk = await prisma.kiosk.update({
            data: { inactivityTimeoutEnabled: enabled },
            where: { id: kioskId },
        });

        return NextResponse.json(updatedKiosk);
    } catch {
        return NextResponse.json({ error: "Erreur lors de la mise à jour de la borne" }, { status: 500 });
    }
}