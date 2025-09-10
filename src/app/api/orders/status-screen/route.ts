import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: twoHoursAgo,
                },
                status: {
                    in: ['AWAITING_PAYMENT', 'PENDING', 'COMPLETED'],
                },
            },
            select: {
                id: true,
                orderNumber: true,
                status: true,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return NextResponse.json(orders);
    } catch {
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}