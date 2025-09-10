import { PageRenderer } from "@/components/page-renderer"
import prisma from "@/lib/prisma"
import Image from "next/image"
import { notFound } from "next/navigation"

async function getPageData(id: number) {
    return await prisma.page.findUnique({
        include: { blocks: { orderBy: { order: "asc" } } },
        where: { id },
    })
}

export default async function PublicCustomPage({ params }: { params: { id: string } }) {
    const id = Number.parseInt(params.id as string)
    if (isNaN(id)) return notFound()
    
    const pageData = await getPageData(id)
    if (!pageData) return notFound()

    if (pageData.backgroundType === "image" && pageData.backgroundValue) {
        return (
            <div className="min-h-screen relative">
                <Image
                    alt={pageData.name}
                    className="object-cover -z-10"
                    fill
                    src={pageData.backgroundValue}
                />
                <div className="relative z-10">
                    <PageRenderer blocks={pageData.blocks} />
                </div>
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: pageData.backgroundValue || "transparent", minHeight: "100vh" }}>
            <PageRenderer blocks={pageData.blocks} />
        </div>
    )
}