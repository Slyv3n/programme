'use client';

import { InactivityWarningModal } from "@/components/common/InactivityWarningModal";
import { useLicense } from "@/context/LicenseContext";
import { useInactivityTimeout } from "@/hooks/use-inactivity-timeout";
import { useKioskHeartbeat } from "@/hooks/use-kiosk-heartbeat";
import { useKioskNavigation } from "@/hooks/use-kiosk-navigation";
import { ShieldAlert } from "lucide-react";

const LicenseErrorScreen = ({ error }: { error: string | null }) => (
  <div className="bg-gray-100 flex flex-col h-screen items-center justify-center p-4 text-center w-full">
    <ShieldAlert className="h-16 mb-4 text-red-500 w-16" />
    <h1 className="font-bold text-3xl text-gray-800">Licence Invalide</h1>
    <p className="mt-2 text-lg text-muted-foreground">{error || "Cette borne n'est pas autorisée à fonctionner."}</p>
  </div>
);

export default function KioskLayout({ children }: { children: React.ReactNode }) {
    const { isLicenseValid, error, inactivityTimeoutEnabled } = useLicense();

    const inactivityData = useInactivityTimeout({
        enabled: inactivityTimeoutEnabled,
        timeout: 20000,
        warningTimeout: 10000
    });

    useKioskHeartbeat({ enabled: isLicenseValid, kioskName: useKioskNavigation().kioskId });

    if (!isLicenseValid) {
        return <LicenseErrorScreen error={error} />;
    }

    return (
        <>
            <main className="h-screen overflow-y-auto w-screen">{children}</main>
            
            <InactivityWarningModal countdown={inactivityData.countdown} isOpen={inactivityData.isWarningVisible} maxCountdown={10} onContinue={inactivityData.continueSession} />
        </>
    );
}