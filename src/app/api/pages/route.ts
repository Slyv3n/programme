import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const pages = await prisma.page.findMany({
            orderBy: { id: "desc" },
        })
        return NextResponse.json(pages)
    } catch {
        return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const { name, backgroundType, backgroundValue } = await request.json()

        const page = await prisma.page.create({
            data: {
                name,
                backgroundType,
                backgroundValue,
            },
        })

        return NextResponse.json(page)
    } catch {
        return NextResponse.json({ error: "Failed to create page" }, { status: 500 })
    }
}