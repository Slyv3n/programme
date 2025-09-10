'use client';

import { HelpNotification } from "@/components/admin/HelpNotification";
import Providers from "@/app/providers";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminLicenseWarning } from "@/components/admin/AdminLicenseWarning";
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { Lock } from "lucide-react";
import { LicenseProvider } from "@/context/LicenseContext";
import { Toaster } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useBeforeUnload } from "@/hooks/useBeforeUnload";

const DisabledContent = () => (
    <div className="container mx-auto py-20 text-center flex flex-col items-center">
        <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Fonctionnalité Verrouillée</h2>
        <p className="mt-2 text-muted-foreground max-w-md">
            Veuillez configurer une licence valide dans les <Link href="/admin/settings" className="underline font-bold text-primary">paramètres</Link> pour accéder à cette page.
        </p>
    </div>
);

function AdminUI({
    children,
    licenseState
}: {
    children: React.ReactNode;
    licenseState: { isValid: boolean; error: string | null; hasHappyHour: boolean; };
}) {
    const { status } = useSession();
    const pathname = usePathname();
    const isSettingsPage = pathname === '/admin/settings';

    useBeforeUnload();

    useEffect(() => {
        if (status === 'unauthenticated' && pathname !== '/login') {
            signOut({ callbackUrl: '/login?error=SessionExpired' });
        }
    }, [status, pathname]);

    return (
        <LicenseProvider
                inactivityTimeoutEnabled={false}
                isLicenseValid={licenseState.isValid} 
                error={licenseState.error}
                hasHappyHour={licenseState.hasHappyHour}
            >
                <div>
                    <AdminHeader />
                    <AdminLicenseWarning />
            
                    <main>
                        {(licenseState.isValid || isSettingsPage) ? children : <DisabledContent />}
                    </main>

                    <HelpNotification />
                    <Toaster />
                </div>
            </LicenseProvider>
    );
}

export function AdminLayoutClient({ 
    children, 
    licenseState 
}: { 
    children: React.ReactNode; 
    licenseState: { isValid: boolean; error: string | null; hasHappyHour: boolean; };
}) {
    
    return (
        <Providers>
            <AdminUI licenseState={licenseState}>
                {children}
            </AdminUI>
        </Providers>
    );
}