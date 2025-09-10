'use client';

import { AdminModal } from "./AdminModal";
import { useAppInitializer } from "@/hooks/useAppInitializer";
import { useKioskNavigation } from "@/hooks/use-kiosk-navigation";
import { usePathname } from "next/navigation";
import { LicenseProvider } from "@/context/LicenseContext";
import { NavigationEvents } from "../common/NavigationEvents";
import { AppLoader } from "../common/AppLoader";
import { LicenseErrorScreen } from "../common/LicenseErrorScreen";
import { useSettingsStore } from "@/store/settings-store";

function KioskLogic() {
    const { kioskId } = useKioskNavigation();
    const { tasks, licenseError } = useAppInitializer(kioskId);
    const isReadyToDisplay = Object.values(tasks).every(status => status !== 'loading');
    const isLicenseValid = tasks.license === 'success';

    if (!isReadyToDisplay) {
        return <AppLoader tasks={tasks} />;
    }

    if (!isLicenseValid) {
        return <LicenseErrorScreen error={licenseError} />;
    }

    return null;
}

export function ClientStateWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isKioskPage = !pathname.startsWith('/admin') && !pathname.startsWith('/kitchen') && pathname !== '/login';

    const inactivityTimeoutEnabled = useSettingsStore(state => state.inactivityTimeoutEnabled);

    if (isKioskPage) {
        const kioskStatusComponent = KioskLogic();
        if (kioskStatusComponent) {
            return kioskStatusComponent;
        }
    }

    return (
        <LicenseProvider
            error={null}
            hasHappyHour={false}
            inactivityTimeoutEnabled={inactivityTimeoutEnabled}
            isLicenseValid={true}
        >
            {children}
            <AdminModal />
            <NavigationEvents />
        </LicenseProvider>
    );
}