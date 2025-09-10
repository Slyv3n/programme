import { ProductPageClient } from "@/components/products/ProductPageClient";
import { getProductById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { id: string } }) {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
        notFound();
    }
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return <ProductPageClient product={product} />
}