'use client';

import { createContext, ReactNode, useContext } from "react";

interface LicenseContextType {
    error: string | null;
    inactivityTimeoutEnabled: boolean;
    isLicenseValid: boolean;
    hasHappyHour: boolean;
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

export function LicenseProvider({
    children,
    error,
    hasHappyHour,
    inactivityTimeoutEnabled,
    isLicenseValid,
}: {
    children: ReactNode;
    error: string | null;
    hasHappyHour: boolean;
    inactivityTimeoutEnabled: boolean;
    isLicenseValid: boolean;
}) {
    return (
        <LicenseContext.Provider value={{ error, hasHappyHour, inactivityTimeoutEnabled, isLicenseValid }}>
            {children}
        </LicenseContext.Provider>
    );
}

export function useLicense() {
    const context = useContext(LicenseContext);
    if (context === undefined) {
        throw new Error("useLicense doit être utilisé à l'intérieur d'un LicenseProvider");
    }
    return context;
}