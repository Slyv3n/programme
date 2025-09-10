import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const licenseKeySetting = await prisma.setting.findUnique({
            where: { id: 'LICENSE_KEY' },
        });

        if (!licenseKeySetting) {
            return NextResponse.json({ error: "Clé de licence non configurée" }, { status: 404 });
        }

        return NextResponse.json({ value: licenseKeySetting.value });
    } catch {
        return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
    }
}