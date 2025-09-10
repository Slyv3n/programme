import { SettingsForm } from "@/components/admin/SettingsForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle } from "lucide-react";
import { headers } from "next/headers";

async function getSettingsData() {
    const licenseKeySetting = await prisma.setting.findUnique({
        where: { id: 'LICENSE_KEY' },
    });

    const activeThemeSetting = await prisma.setting.findUnique({
        where: { id: 'ACTIVE_THEME' },
    });

    const licenseKey = licenseKeySetting?.value;
    const activeTheme = activeThemeSetting?.value || 'default';

    if (!licenseKey) {
        return { licenseKey: '', activeTheme, licenseDetails: null, isValid: false, validationError: "Clé non configurée." };
    }

    const licenseDetails = await prisma.license.findUnique({
        include: { tier: true, kiosks: true, },
        where: { id: licenseKey },
    });

    if (!licenseDetails) {
        return { licenseKey, activeTheme, licenseDetails: null, isValid: false, validationError: "Clé de licence invalide." };
    }

    let isValid = true;
    let validationError = "";

    if (!licenseDetails.isActive) {
        isValid = false;
        validationError = "La licence est inactive.";
    }

    if (isValid && licenseDetails.expiresAt && new Date() > licenseDetails.expiresAt) {
        isValid = false;
        validationError = `La licence a expiré le ${format(new Date(licenseDetails.expiresAt), "PPP", { locale: fr })}.`;
    }

    const requestHost = (await headers()).get('host');
    if (isValid && licenseDetails.allowedDomain && requestHost !== licenseDetails.allowedDomain) {
        isValid = false;
        validationError = `La licence n'est pas valide pour ce domaine (${requestHost}).`;
    }


    return { licenseKey, activeTheme, licenseDetails, isValid, validationError };
}

export default async function AdminSettingsPage() {
    const { licenseKey, activeTheme, licenseDetails, isValid, validationError } = await getSettingsData();

    return (
        <div className="container mx-auto py-10">
            <h1 className="font-bold mb-6 text-3xl">Paramètres Généraux</h1>

            {!isValid && licenseDetails && (
                <Alert className="mb-6" variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Licence Inactive</AlertTitle>
                    <AlertDescription>
                        {validationError} Les fonctionnalités de la borne sont désactivées.
                    </AlertDescription>
                </Alert>
            )}

            <div className="gap-8 grid md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Clé de Licence</CardTitle>
                        <CardDescription>Entrez la clé de licence fournie pour activer les bornes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SettingsForm initialSettings={{ licenseKey, activeTheme }} />
                    </CardContent>
                </Card>

                <Card className={cn(!isValid && licenseDetails && 'border-destructive')}>
                    <CardHeader>
                        <CardTitle>Détails de la Licence Actuelle</CardTitle>
                        <CardDescription>Informations sur votre plan et votre utilisation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {licenseDetails ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Client</h3>
                                    <p className="text-muted-foreground">{licenseDetails.clientName}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Clé</h3>
                                    <p className="font-mono text-muted-foreground text-sm">{licenseDetails.id}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Statut</h3>
                                    <Badge variant={licenseDetails.isActive ? "secondary" : "destructive"}>
                                        {licenseDetails.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Palier</h3>
                                    <p className="text-muted-foreground">{licenseDetails.tier.name}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Date d&apos;expiration</h3>
                                    <p className="text-muted-foreground">
                                        {licenseDetails.expiresAt
                                            ? format(new Date(licenseDetails.expiresAt), "PPP", { locale: fr })
                                            : 'Permanente'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Domaine Autorisé</h3>
                                    <p className="font-mono text-muted-foreground text-sm">
                                        {licenseDetails.allowedDomain || 'Tous les domaines'}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Utilisation des Bornes</h3>
                                    <p className="font-bold text-2xl">
                                        {licenseDetails.kiosks.length} / {licenseDetails.tier.maxKiosks}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground">Aucune licence valide trouvée pour la clé saisie.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}