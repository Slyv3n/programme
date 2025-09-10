'use client';

import { useLicense } from "@/context/LicenseContext";

export function AdminLicenseWarning() {
    const { isLicenseValid } = useLicense();

    if (isLicenseValid) {
        return null;
    }

    return (
        <div className="bg-red-100 border border-red-300 container mt-4 mx-auto p-4 rounded-md text-red-700">
            <strong>Licence invalide.</strong> Veuillez configurer une clé de licence valide dans les paramètres pour activer toutes les fonctionnalités.
        </div>
    );
}