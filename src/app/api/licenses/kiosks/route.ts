import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
const ONLINE_THRESHOLD_SECONDS = 30;

export async function GET() {
    try {
        const licenseKeySetting = await prisma.setting.findUnique({
            where: { id: 'LICENSE_KEY' },
        });

        if (!licenseKeySetting?.value) {
            return NextResponse.json([]);
        }

        const kiosks = await prisma.kiosk.findMany({
            orderBy: {
                name: 'asc',
            },
            where: {
                licenseId: licenseKeySetting.value,
            },
        });

        const kiosksWithStatus = kiosks.map(kiosk => {
            const diffSeconds = (new Date().getTime() - new Date(kiosk.lastHeartbeat).getTime()) / 1000;
            const isOnline = diffSeconds < ONLINE_THRESHOLD_SECONDS;
            return { ...kiosk, isOnline };
        });

        return NextResponse.json(kiosksWithStatus);
    } catch {
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}