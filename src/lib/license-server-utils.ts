import 'server-only';
import prisma from "./prisma";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

export async function checkAdminLicense(requestHost: string | null) {
    try {
        const licenseKey = (await prisma.setting.findUnique({ where: { id: 'LICENSE_KEY' } }))?.value;
        if (!licenseKey) return { isValid: false, error: "Aucune clé de licence n'est configurée.", hasHappyHour: false };

        const license = await prisma.license.findUnique({ include: { tier: true }, where: { id: licenseKey } });

        if (!license || !license.tier) return { isValid: false, error: "La licence configurée n'existe pas.", hasHappyHour: false };
        if (!license.isActive) return { isValid: false, error: "La licence est inactive.", hasHappyHour: false };
        if (license.expiresAt && new Date() > license.expiresAt) return { isValid: false, error: `La licence a expiré le ${format(new Date(license.expiresAt), "PPP", { locale: fr })}.`, hasHappyHour: false };

        if (license.allowedDomain && requestHost !== license.allowedDomain) return { isValid: false, error: `La licence n'est pas valide pour ce domaine (${requestHost}).`, hasHappyHour: false };

        return { isValid: true, error: null, hasHappyHour: license.tier.hasHappyHour };
    } catch {
        return { isValid: false, error: "Erreur de connexion à la base de données.", hasHappyHour: false };
    }
}