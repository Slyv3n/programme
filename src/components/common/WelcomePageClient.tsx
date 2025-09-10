'use client';

import { useSettingsStore } from "@/store/settings-store";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import Image from "next/image";
import { StartOrderButton } from "./StartOrderButton";

interface WelcomePageClientProps {
    settings: {
        bgUrl: string;
        subtitle: string;
        title: string;
    };
}

export function WelcomePageClient({ settings }: WelcomePageClientProps) {
    const { showAdminMenu } = useSettingsStore();
    const [clickCount, setClickCount] = useState(0);
    const clickTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (clickTimer.current) {
                clearTimeout(clickTimer.current);
            }
        };
    }, []);

    const handleSecretClick = () => {
        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
        }
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
        <div className="bg-black flex flex-col h-screen items-center justify-center relative text-center text-white w-full">
            <LanguageSwitcher />

            <div
                className="absolute bg-white/5 duration-300 h-24 hover:bg-white/20 right-0 rounded-bl-lg top-20 transition-colors w-24 z-50"
                onClick={handleSecretClick}
            />

            <Image
                alt="Fond d'écran du restaurant"
                className="-z-10 brightness-50"
                fill
                objectFit="cover"
                priority
                quality={75}
                src={settings.bgUrl}
            />

            <h1 className="drop-shadow-lg font-extrabold mb-4 text-6xl md:text-8xl">
                {settings.title}
            </h1>
            <p className="drop-shadow-md mb-8 text-xl md:text-2xl">
                {settings.subtitle}
            </p>

            <StartOrderButton />
        </div>
    );
}