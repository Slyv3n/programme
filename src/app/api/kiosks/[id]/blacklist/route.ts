import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        await prisma.kiosk.update({
            data: { isBlacklisted: true },
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Borne non trouvée" }, { status: 404 });
    }
}