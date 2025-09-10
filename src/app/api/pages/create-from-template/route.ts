import { pageTemplates } from "@/lib/page-templates";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { pageName, pageSlug, templateName } = await request.json();

        const template = pageTemplates.find(t => t.name === templateName);
        if (!template) {
            return NextResponse.json({ error: "Modèle non trouvé" }, { status: 404 });
        }

        const newPage = await prisma.page.create({
            data: {
                blocks: {
                    create: template.blocks.map(block => ({
                        content: block.content as any,
                        order: block.order,
                        type: block.type,
                    })),
                },
                name: pageName,
                slug: pageSlug,
            },
        });

        return NextResponse.json(newPage, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Erreur lors de la création de la page" }, { status: 500 });
    }
}