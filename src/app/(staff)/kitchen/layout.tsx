import { checkAdminLicense } from "@/lib/license-server-utils";
import { ShieldAlert } from "lucide-react";
import { headers } from "next/headers";

const KitchenLicenseError = ({ error }: { error: string | null }) => (
    <div className="bg-gray-100 flex flex-col h-screen items-center justify-center p-4 text-center w-full">
        <ShieldAlert className="h-16 mb-4 text-red-500 w-16" />
        <h1 className="font-bold text-3xl text-gray-800">Licence Invalide</h1>
        <p className="mt-2 text-lg text-muted-foreground">
            L&apos;écran de cuisine ne peut pas démarrer car la licence est invalide ou expirée.
        </p>
        <p className="mt-2 text-red-600 text-sm">({error})</p>
    </div>
)

export default async function KitchenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = headers();
    const requestHost = (await headersList).get('host');
    const licenseState = await checkAdminLicense(requestHost);

    if (!licenseState.isValid) {
        return <KitchenLicenseError error={licenseState.error} />;
    }

    return (
        <>
            {children}
        </>
    );
}