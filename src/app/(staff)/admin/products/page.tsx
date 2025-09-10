import { ProductTable } from "@/components/admin/ProductTable";
import { Button } from "@/components/ui/button";
import { getProductsForAdmin } from "@/lib/data";
import Link from "next/link";

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams?: { sortBy?: string; order?: 'asc' | 'desc'; query?: string };
}) {
    const sortBy = searchParams?.sortBy || 'name';
    const order = searchParams?.order || 'asc';
    const query = searchParams?.query;
    
    const products = await getProductsForAdmin({ sortBy, order, query });

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-bold text-3xl">Gestion des Produits</h1>
                    <p className="text-muted-foreground">Ajoutez, modifiez ou supprimez les produits de votre menu.</p>
                </div>
                <Button asChild>
                    <Link href="/kitchen">Voir l&apos;écran cuisine</Link>
                </Button>
            </div>
            
            <ProductTable products={products} />
        </div>
    );
}