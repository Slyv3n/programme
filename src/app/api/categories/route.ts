import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    const whereClause = query ? {
        name: {
            contains: query,
            mode: 'insensitive' as const,
        }
    } : {};

    const sortBy = searchParams.get('sortBy') || 'position';
    const order = searchParams.get('order') || 'asc';

    const categories = await prisma.category.findMany({
        orderBy: {
            [sortBy]: order,
        },
        where: whereClause,
    });
    return NextResponse.json(categories);
}

export async function POST(
    request: NextRequest
) {
    const { name, position } = await request.json();
    const newCategory = await prisma.category.create({
        data: {
            name,
            position: position ? parseInt(position) : null,
        }
    });
    return NextResponse.json(newCategory, { status: 201 });
}