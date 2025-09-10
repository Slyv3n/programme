
"use client"

import useSWR from "swr";
import { ProductWithRelations } from "@/lib/prisma-types";
import { Category } from "@prisma/client";
import { useUserStore } from "@/store/user-store";
import { useLicense } from "@/context/LicenseContext";
import { useEffect, useMemo, useState } from "react";
import { cn, isHappyHour } from "@/lib/utils";
import Pusher from "pusher-js";
import { Star } from "lucide-react";
import { ProductList } from "../products/ProductList";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function ProductGridBlock({ block, isEditMode }: { block: any, isEditMode: boolean }) {
    const { user } = useUserStore()
    const { hasHappyHour: licenseHasHappyHour } = useLicense()
    const [activeFilter, setActiveFilter] = useState('Tous')

    const { data: allProducts, mutate: mutateProducts } = useSWR<ProductWithRelations[]>('/api/products', fetcher);
    const { data: allCategories, mutate: mutateCategories } = useSWR<Category[]>('/api/categories', fetcher);

    const config = block.content as any || {}
    const title = config.title || "Faites votre choix !"
    const showPrices = config.showPrices ?? true
    const showNames = config.showNames ?? true
    const showImages = config.showImages ?? true
    const filterCategory = config.category || "all"
    const columns = config.columns || 3

    const isTimeForHappyHour = isHappyHour();
    const happyHourIsActive = licenseHasHappyHour && isTimeForHappyHour;

    useEffect(() => {
        const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });
        const channel = pusherClient.subscribe('menu-updates');
        const handleUpdate = () => {
            mutateProducts();
            mutateCategories();
        };
        channel.bind('update', handleUpdate);
        return () => {
            pusherClient.unsubscribe('menu-updates');
        };
    }, [mutateProducts, mutateCategories]);

    const activeCategoryNames = useMemo(() => new Set(allProducts?.map(p => p.category?.name).filter(Boolean)), [allProducts]);

    const displayedProducts = useMemo(() => {
        if (!allProducts) return [];
        if (activeFilter === 'rewards') {
            return allProducts.filter(p => p.pointCost && p.pointCost > 0);
        }
        if (activeFilter === 'Tous') {
            return allProducts.filter(p => !p.pointCost || p.pointCost === 0);
        }
        return allProducts.filter(p => p.category?.name === activeFilter);
    }, [activeFilter, allProducts]);

    if (!allProducts || !allCategories) return <div className="p-10 text-center text-muted-foreground">Chargement du menu...</div>;

    return (
        <div className={cn({ 'pointer-events-none': isEditMode })}>
            <div className="bg-white shadow-md sticky top-0 z-30">
                <header className="border-b p-4">
                    <h1 className="font-bold text-3xl text-center">Faites votre choix !</h1>
                    {happyHourIsActive && (
                        <div className="bg-orange-500 font-bold mt-2 p-2 rounded-md text-center text-white">
                            🎉 HAPPY HOUR ! Profitez de nos offres spéciales ! 🎉
                        </div>
                    )}
                </header>
                <nav className="bg-white p-4">
                    <ul className="flex flex-wrap gap-2 md:gap-4 justify-center">
                        <li>
                            <button
                                className={cn(
                                    'font-semibold px-4 py-2 rounded-full transition-colors',
                                    activeFilter === 'Tous' ? 'bg-orange-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                )}
                                onClick={() => setActiveFilter('Tous')}
                            >
                                Tous
                            </button>
                        </li>
                        {user && (
                            <li>
                                <button
                                    className={cn(
                                        'flex font-semibold items-center px-4 py-2 rounded-full transition-colors',
                                        activeFilter === 'rewards' ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                    )}
                                    onClick={() => setActiveFilter('rewards')}
                                >
                                    <Star className="h-4 mr-2 w-4" />Cadeaux Fidélité
                                </button>
                            </li>
                        )}
                        {allCategories.map((category) => {
                            const isDisabled = !activeCategoryNames.has(category.name);
                            return (
                                <li key={category.id}>
                                    <button
                                        className={cn(
                                            'font-semibold px-4 py-2 rounded-full transition-colors',
                                            activeFilter === category.name ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                                            isDisabled && 'cursor-not-allowed opacity-50'
                                        )}
                                        disabled={isDisabled}
                                        onClick={() => setActiveFilter(category.name)}
                                    >
                                        {category.name}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
            
            <ProductList
                isHappyHourActive={happyHourIsActive}
                products={displayedProducts}
                showPrices={showPrices}
                showNames={showNames}
                showImages={showImages}
                columns={columns}
            />
        </div>
    );
}