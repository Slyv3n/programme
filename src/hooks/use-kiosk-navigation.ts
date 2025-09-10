'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export function useKioskNavigation() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const kioskId = searchParams.get('kioskId');

    const buildUrl = useCallback((pathname: string) => {
        return kioskId ? `${pathname}?kioskId=${kioskId}` : pathname;
    }, [kioskId]);

    const navigate = useCallback((pathname: string) => {
        router.push(buildUrl(pathname));
    }, [router, buildUrl]);

    const back = useCallback(() => {
        router.back();
    }, [router]);

    return { buildUrl, navigate, back, kioskId };
}