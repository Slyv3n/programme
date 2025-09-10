import prisma from "@/lib/prisma";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number.parseInt(params.id)

        const page = await prisma.page.findUnique({
            include: {
                blocks: {
                    orderBy: { order: "asc" },
                }
            },
            where: { id },
        })

        if (!page) {
            return NextResponse.json({ error: "Page not found" }, { status: 404 })
        }

        return NextResponse.json(page)
    } catch {
        return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number.parseInt(params.id);
        const data = await request.json();

        const updatedPage = await prisma.page.update({
            data: {
                name: data.name,
                layoutType: data.layoutType,
                backgroundType: data.backgroundType,
                backgroundValue: data.backgroundValue,
            },
            where: { id },
        })

        return NextResponse.json(updatedPage)
    } catch {
        return NextResponse.json({ error: "Failed to update page" }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const id = Number.parseInt(params.id)
        const { name, config } = await request.json()

        const updateData: any = {}

        if (name !== undefined) updateData.name = name

        if (config?.backgroundColor) {
            updateData.backgroundType = "color"
            updateData.backgroundValue = config.backgroundColor
        }
        if (config?.backgroundImage) {
            updateData.backgroundType = "image"
            updateData.backgroundValue = config.backgroundImage
        }

        const page = await prisma.page.update({
            data: updateData,
            where: { id },
        })

        return NextResponse.json(page)
    } catch {
        return NextResponse.json({ error: "Failed to update page" }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number.parseInt(params.id)

        await prisma.page.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: "Failed to delete page" }, { status: 500 })
    }
}