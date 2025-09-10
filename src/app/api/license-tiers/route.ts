import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const tiers = await prisma.licenseTier.findMany({
        orderBy: { maxKiosks: 'asc' },
    });
    return NextResponse.json(tiers);
}