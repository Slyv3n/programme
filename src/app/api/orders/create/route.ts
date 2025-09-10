import prisma from "@/lib/prisma";
import { CartItem } from "@/store/cart-store";
import { SelectedOptionWithQuantity } from "@/types";
import { NextResponse } from "next/server";

async function getNextOrderNumber() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const countToday = await prisma.order.count({
        where: { createdAt: { gte: today } },
    });

    return 100 + countToday;
}

function formatCustomizations(item: CartItem): string {
    const options = Object.values(item.selectedOptions || {}).flat()
        .map((opt: SelectedOptionWithQuantity) => {
            const subOptionText = opt.selectedSubOption ? ` (${opt.selectedSubOption.name})` : '';
            return `${opt.option.name}${subOptionText} (x${opt.quantity})`;
        });

    const ingredients = Object.entries(item.selectedIngredients || {})
        .map(([id, status]) => {
            const ing = item.product.ingredientGroups?.flatMap(g => g.items).find(i => i.id.toString() === id);
            if (!ing) return '';
            if (status === 'removed') return `sans ${ing.name}`;
            if (status === 'added') return `avec ${ing.name} (Suppl.)`;
            return '';
        }).filter(Boolean);

    return [...options, ...ingredients].join(', ');
}

export async function POST(request: Request) {
    try {
        const { items, grandTotal, userId, orderType } = await request.json();

        if (!items || items.length === 0 || typeof grandTotal !== 'number') {
            return NextResponse.json({ error: "Données de commande invalides" }, { status: 400 });
        }

        const pointsSpent = (items as CartItem[])
            .filter(item => item.product.pointCost)
            .reduce((sum, item) => sum + (item.product.pointCost || 0) * item.quantity, 0);

        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (user && user.points < pointsSpent) {
                return NextResponse.json({ error: "Solde de points insuffisant." }, { status: 400 });
            }
            await prisma.user.update({
                where: { id: userId },
                data: { points: { increment: Math.floor(grandTotal * 10) - pointsSpent } },
            });
        }

        const orderNumber = await getNextOrderNumber();

        const newOrder = await prisma.order.create({
            data: {
                orderNumber,
                total: grandTotal,
                status: 'AWAITING_PAYMENT',
                userId: userId,
                orderType: orderType || 'a-emporter',
                items: {
                    create: (items as CartItem[]).map((item) => ({
                        productName: item.product.name,
                        quantity: item.quantity,
                        unitPrice: item.totalPrice,
                        customizations: formatCustomizations(item) || null,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(newOrder, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}