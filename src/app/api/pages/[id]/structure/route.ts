import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pageId = parseInt(params.id);
    const { containers } = await request.json();

    const updateTransactions: any[] = [];

    // On parcourt chaque conteneur pour mettre à jour ses enfants
    for (const containerId in containers) {
      const blockIds = containers[containerId] as number[];
      const parentId = containerId.includes('-') ? parseInt(containerId.split('-')[0]) : null;
      const columnKey = containerId.includes('-') ? containerId.split('-')[1] : null;

      blockIds.forEach((blockId, index) => {
        updateTransactions.push(
          prisma.block.update({
            where: { id: blockId },
            data: { 
              order: index,
              parentId: parentId,
              columnKey: columnKey,
            },
          })
        );
      });
    }

    await prisma.$transaction(updateTransactions);

    // On rafraîchit le cache de la page modifiée
    const page = await prisma.page.findUnique({ where: { id: pageId } });
    if (page?.systemPageType) {
      const path = getPathForSystemPage(page.systemPageType);
      if (path) revalidatePath(path);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur de sauvegarde de structure:", error);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }
}

// Fonction utilitaire pour trouver le chemin de la page
const getPathForSystemPage = (systemType: string | null) => {
    switch (systemType) {
        case 'WELCOME': return '/';
        case 'ORDER_TYPE': return '/order-type';
        case 'MENU': return '/menu';
        default: return null;
    }
};