'use client';

import { LicenseGenerator } from "@/components/admin/LicenseGenerator";

export default function AdminLicensesPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="font-bold mb-6 text-3xl">Gestion des Licences</h1>
            <div className="gap-8 grid md:grid-cols-2">
                <div>
                    <h2 className="font-semibold mb-2 text-xl">Générer une nouvelle licence</h2>
                    <LicenseGenerator />
                </div>
                <div>
                    <h2 className="font-semibold mb-2 text-xl">Licences Actives</h2>
                </div>
            </div>
        </div>
    );
}