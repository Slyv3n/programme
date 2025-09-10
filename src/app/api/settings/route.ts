import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const licenseKey = body.licenseKey ?? '';
        const activeTheme = body.activeTheme ?? 'default';
        const homepageSlug = body.homepageSlug ?? '';

        await prisma.$transaction([
            prisma.setting.upsert({
                create: { id: 'LICENSE_KEY', value: licenseKey },
                update: { value: licenseKey },
                where: { id: 'LICENSE_KEY' },
            }),
            prisma.setting.upsert({
                create: { id: 'ACTIVE_THEME', value: activeTheme },
                update: { value: activeTheme },
                where: { id: 'ACTIVE_THEME' },
            }),
            prisma.setting.upsert({
                create: { id: 'HOMEPAGE_SLUG', value: homepageSlug },
                update: { value: homepageSlug },
                where: { id: 'HOMEPAGE_SLUG' },
            }),
        ]);

        revalidatePath('/');
        revalidatePath('/', 'layout');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erreur API /api/settings:", error);
        return NextResponse.json({ error: "Erreur lors de la sauvegarde des paramètres" }, { status: 500 });
    }
}