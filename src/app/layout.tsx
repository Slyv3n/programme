import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientStateWrapper } from "@/components/admin/ClientStateWrapper";
import { HelpButton } from "@/components/common/HelpButton";
import { Suspense } from "react";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import prisma from "@/lib/prisma";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Borne de Commande",
    description: "Application de borne de commande Next.js",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const activeTheme = await prisma.setting.findUnique({
        where: { id: 'ACTIVE_THEME' },
    });
    const themeClass = activeTheme?.value || 'default';

    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={`${inter.className}`}>
                <Suspense>
                    <ClientStateWrapper>
                        {children}
                    </ClientStateWrapper>
                    <HelpButton />
                    <LoadingOverlay />
                </Suspense>
            </body>
        </html>
    );
}