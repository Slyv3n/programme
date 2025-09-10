import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: kioskId } = await context.params;
        const { kioskName } = await request.json();

        const kiosk = await prisma.kiosk.update({
            where: { id: kioskId },
            data: {
                name: kioskName,
                lastHeartbeat: new Date()
            },
        });

        const forceLogout = kiosk.forceLogout;
        const forceRefresh = kiosk.forceRefresh;

        if (forceLogout || forceRefresh) {
            await prisma.kiosk.update({
                data: { forceLogout: false, forceRefresh: false },
                where: { id: kioskId },
            });
        }

        return NextResponse.json({ status: 'ok', forceLogout, forceRefresh });
    } catch {
        return NextResponse.json({ error: "Borne non reconnue" }, { status: 404 });
    }
}