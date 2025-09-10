'use client';

import { useUIStore } from "@/store/ui-store";
import { Loader2 } from "lucide-react";

export function LoadingOverlay() {
    const { isNavigating } = useUIStore();

    if (!isNavigating) return null;

    return (
        <div className="backdrop-blur-sm bg-white/90 fixed flex flex-col inset-0 items-center justify-center z-[999]">
            <Loader2 className="animate-spin h-16 text-primary w-16" />
        </div>
    );
}