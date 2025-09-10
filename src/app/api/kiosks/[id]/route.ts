import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id: kioskId } = await context.params;
        console.log(`[API DELETE /kiosks] Reçu l'ordre de supprimer la borne: ${kioskId}`);

        const beforeDelete = await prisma.kiosk.findUnique({ where: { id: kioskId } });
        if (!beforeDelete) {
            console.log(`[API DELETE /kiosks] La borne ${kioskId} n'existait déjà plus.`);
            return new NextResponse(null, { status: 204 });
        }

        await prisma.kiosk.delete({ where: { id: kioskId } });

        console.log(`[API DELETE /kiosks] Borne ${kioskId} supprimée avec succès de la BDD.`);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[API DELETE /kiosks] ERREUR:", error);
        return NextResponse.json({ error: "Borne non trouvée ou erreur lors de la suppression" }, { status: 500 });
    }
}