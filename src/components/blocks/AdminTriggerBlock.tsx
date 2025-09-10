'use client';

import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/store/settings-store";
import { useEffect, useRef, useState } from "react";

export function AdminTriggerBlock({ content }: { content: any }) {
    const { showAdminMenu } = useSettingsStore();
    const [clickCount, setClickCount] = useState(0);
    const clickTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (clickTimer.current) clearTimeout(clickTimer.current);
        }
    }, []);

    const handleSecretClick = () => {
        if (clickTimer.current) clearTimeout(clickTimer.current);

        const newCount = clickCount + 1;
        setClickCount(newCount);

        if (newCount >= 5) {
            showAdminMenu();
            setClickCount(0);
        } else {
            clickTimer.current = setTimeout(() => {
                setClickCount(0);
            }, 2000);
        }
    };

    return (
        <div
            className={cn(
                "absolute z-50",
                "top-20 right-0 w-24 h-24"
            )}
            onClick={handleSecretClick}
        />
    );
}