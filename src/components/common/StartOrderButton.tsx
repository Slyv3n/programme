'use client';

import { useKioskNavigation } from "@/hooks/use-kiosk-navigation";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export function StartOrderButton() {
    const { t } = useTranslation();
    const { buildUrl } = useKioskNavigation();

    return (
        <Link
            className="bg-orange-500 duration-300 ease-in-out font-bold hover:scale-105 px-12 py-6 rounded-full shadow-lg text-2xl text-white transform transition-transform"
            href={buildUrl('/order-type')} 
        >
            {t('start_ordering')}
        </Link>
    );
}