import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const activeTheme = await prisma.setting.findUnique({
        where: { id: 'ACTIVE_THEME' },
    });

    return NextResponse.json({ activeTheme: activeTheme?.value || 'default' });
}