import { PageRenderer } from "@/components/PageRenderer";
import prisma from "@/lib/prisma";

async function getMenuPageData() {
    return await prisma.page.findUnique({
        include: { blocks: true },
        where: { systemPageType: 'MENU' },
    });
}

export default async function MenuPage() {
    const pageData = await getMenuPageData();

    if (!pageData) {
        return <p>Page Menu non configurée dans l'administration.</p>;
    }

    const rootBlocks = pageData.blocks.filter(b => b.parentId === null);

    return <PageRenderer blocks={rootBlocks} allBlocks={pageData.blocks} />;
}