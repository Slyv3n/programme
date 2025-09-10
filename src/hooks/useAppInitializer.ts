'use client';

import { getKioskUniqueId } from "@/lib/fingerprint";
import { initI18n } from "@/lib/i18n";
import { useSettingsStore } from "@/store/settings-store";
import { useEffect, useState } from "react";

async function validateLicense(kioskName: string | null) {
    const uniqueId = await getKioskUniqueId();
    
    const response = await fetch('/api/license/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            kioskId: uniqueId,
            kioskName: kioskName || "Borne Inconnue",
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "La validation de la licence a échoué.");
    }

    return await response.json();
}

export type TaskStatus = 'loading' | 'success' | 'error';

export interface InitializationTasks {
    license: TaskStatus;
    settings: TaskStatus;
    i18n: TaskStatus;
}

export function useAppInitializer(kioskName: string | null) {
    const [tasks, setTasks] = useState<InitializationTasks>({
        license: 'loading',
        settings: 'loading',
        i18n: 'loading',
    });
    const [licenseError, setLicenseError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; 

        async function initializeSequentially() {
            try {
                const licenseData = await validateLicense(kioskName);
                if (isMounted) {
                    useSettingsStore.getState().setInactivityTimeoutStatus(licenseData.inactivityTimeoutEnabled);
                    setTasks(prev => ({ ...prev, license: 'success' }))
                };
            } catch (e: unknown) {
                const errorMessage = e instanceof Error ? e.message : "Erreur inconnue";
                if (isMounted) {
                    setLicenseError(errorMessage);
                    setTasks(prev => ({ ...prev, license: 'error' }));
                };
            }

            await Promise.all([
                (async () => {
                    try {
                        await useSettingsStore.persist.rehydrate();
                        if (isMounted) setTasks(prev => ({ ...prev, settings: 'success' }));
                    } catch {
                        if (isMounted) setTasks(prev => ({ ...prev, settings: 'error' }));
                    }
                })(),
                (async () => {
                    try {
                        await initI18n;
                        if (isMounted) setTasks(prev => ({ ...prev, i18n: 'success' }));
                    } catch {
                        if (isMounted) setTasks(prev => ({ ...prev, i18n: 'error' }));
                    }
                })(),
            ]);
        }

        initializeSequentially();

        return () => { isMounted = false };
    }, [kioskName]);

    return { tasks, licenseError };
}