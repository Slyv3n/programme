import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: kioskId } = await context.params;
        await prisma.kiosk.update({
            where: { id: kioskId },
            data: { forceLogout: true },
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Borne non trouvée" }, { status: 404 });
    }
}