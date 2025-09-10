'use client';

import { useLicense } from "@/context/LicenseContext";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";

export function AdminHeader() {
    const { isLicenseValid } = useLicense();

    return (
        <header className="bg-gray-100 border-b p-4">
            <div className="container flex items-center justify-between mx-auto">
                <h1 className="font-bold text-xl">
                    <Link href="/admin">Panel d&apos;Administration</Link>
                </h1>
                <nav className="flex gap-4 items-center">
                    <Button asChild className={cn({ "opacity-50 pointer-events-none": !isLicenseValid })} variant="ghost">
                        <Link href="/admin/products">Produits</Link>
                    </Button>
                    <Button asChild className={cn({ "opacity-50 pointer-events-none": !isLicenseValid })} variant="ghost">
                        <Link href="/admin/orders">Commandes</Link>
                    </Button>
                    <Button asChild className={cn({ "opacity-50 pointer-events-none": !isLicenseValid })} variant="ghost">
                        <Link href="/admin/categories">Catégories</Link>
                    </Button>
                    <Button asChild className={cn({ "opacity-50 pointer-events-none": !isLicenseValid })} variant="ghost">
                        <Link href="/admin/promo-codes">Codes Promo</Link>
                    </Button>
                    <Button asChild className={cn({ "opacity-50 pointer-events-none": !isLicenseValid })} variant="ghost">
                        <Link href="/admin/users">Clients</Link>
                    </Button>
                    <Button asChild className={cn({ "opacity-50 pointer-events-none": !isLicenseValid })} variant="ghost">
                        <Link href="/admin/kiosks">Gestion Bornes</Link>
                    </Button>
                    <Button asChild variant="ghost"><Link href="/admin/settings">Paramètres</Link></Button>

                    <LogoutButton />
                </nav>
            </div>
        </header>
    );
}