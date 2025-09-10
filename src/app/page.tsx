import { PageRenderer } from "@/components/page-renderer";
import prisma from "@/lib/prisma";
import Image from "next/image";

async function getHomepageData() {
    return await prisma.page.findUnique({
        include: { blocks: { orderBy: { order: 'asc' } } },
        where: { systemPageType: 'WELCOME' },
    });
}

export default async function HomePage() {
    const pageData = await getHomepageData();

    if (!pageData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>La page d'accueil (WELCOME) n'a pas été trouvée dans la base de données.</p>
            </div>
        );
    }

    if (pageData.backgroundType === 'video' && pageData.backgroundValue) {
        return (
            <div className="min-h-screen relative">
                <video
                    autoPlay
                    className="absolute brightness-50 h-full inset-0 object-cover w-full -z-10"
                    loop
                    muted
                    playsInline
                >
                    <source src={pageData.backgroundValue} type="video/mp4" />
                </video>
                <div className="relative z-10">
                    <PageRenderer blocks={pageData.blocks} />
                </div>
            </div>
        );
    }

    if (pageData.backgroundType === 'image' && pageData.backgroundValue) {
        return (
            <div className="min-h-screen relative">
                <Image
                    alt={`Fond pour la page ${pageData.name}`}
                    className="brightness-50 object-cover -z-10"
                    fill
                    src={pageData.backgroundValue}
                />
                <div className="relative z-10">
                    <PageRenderer blocks={pageData.blocks} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: pageData.backgroundValue || 'transparent', minHeight: '100vh' }}>
            <PageRenderer blocks={pageData.blocks} />
        </div>
    );
}