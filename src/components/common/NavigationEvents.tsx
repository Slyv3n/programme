'use client';

import { useUIStore } from "@/store/ui-store";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function NavigationEvents() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { stopNavigation } = useUIStore();

    useEffect(() => {
        stopNavigation();
    }, [pathname, searchParams, stopNavigation]);

    return null;
}