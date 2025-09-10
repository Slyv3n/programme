import { PageRenderer } from "@/components/PageRenderer";
import prisma from "@/lib/prisma";

async function getOrderTypePageData() {
    return await prisma.page.findUnique({
        include: { blocks: { orderBy: { order: 'asc' } } },
        where: { systemPageType: 'ORDER_TYPE' },
    });
}

export default async function OrderTypePage() {
    const pageData = await getOrderTypePageData();

    if (!pageData) {
        return <p>Page "Choix du Type de Commande" non configurée.</p>;
    }

    return <PageRenderer blocks={pageData.blocks} />;
}