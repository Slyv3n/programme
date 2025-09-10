import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const FORBIDDEN_KIOSK_NAMES = [
  'ADMIN'
];

export async function POST(request: NextRequest) {
  try {
    const { kioskId, kioskName } = await request.json();

    if (kioskName && FORBIDDEN_KIOSK_NAMES.includes(kioskName.toUpperCase())) {
      throw new Error(`Le nom de borne "${kioskName}" est interdit.`);
    }

    if (!kioskName || kioskName === "Borne Inconnue") {
      throw new Error("Configuration de la borne incomplete. Le nom (kioskId) est manquant dans l'URL de demarrage.");
    }
    if (!kioskId) {
      throw new Error("Données de validation manquantes (fingerprint).");
    }

    const licenseKey = (await prisma.setting.findUnique({ where: { id: 'LICENSE_KEY' } }))?.value;
    if (!licenseKey) throw new Error("Aucune clé de licence n'est configurée dans les paramètres de l'administration.");
    
    const result = await prisma.$transaction(async (tx) => {
      const license = await tx.license.findUnique({
        where: { id: licenseKey, isActive: true },
        include: { tier: true },
      });

      if (!license || !license.tier) throw new Error("Licence invalide ou inactive.");
      if (license.expiresAt && new Date() > license.expiresAt) throw new Error("La licence a expiré.");
      
      const requestHost = request.headers.get('host');
      if (license.allowedDomain && requestHost !== license.allowedDomain) throw new Error("Licence non valide pour ce domaine.");

      const existingKiosk = await tx.kiosk.findUnique({ where: { id: kioskId } });

      if (existingKiosk) {
        if (existingKiosk.isBlacklisted) throw new Error("Cet appareil a ete banni de cette licence.");
        if (existingKiosk.licenseId !== licenseKey) throw new Error("Cet identifiant de borne est déjà utilisé par une autre licence.");

        const updatedKiosk = await tx.kiosk.update({ where: { id: kioskId }, data: { name: kioskName } });
        return { status: 'valid', hasHappyHour: license.tier.hasHappyHour, inactivityTimeoutEnabled: updatedKiosk.inactivityTimeoutEnabled };
      } else {
        const currentKioskCount = await tx.kiosk.count({ where: { licenseId: licenseKey } });
        if (currentKioskCount >= license.tier.maxKiosks) {
          throw new Error("Nombre maximum de bornes atteint.");
        }
        const newKiosk = await tx.kiosk.create({ data: { id: kioskId, name: kioskName, licenseId: licenseKey } });
        return { status: 'valid', hasHappyHour: license.tier.hasHappyHour, inactivityTimeoutEnabled: newKiosk.inactivityTimeoutEnabled };
      }
    });

    return NextResponse.json(result);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.log(errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 403 });
  }
}