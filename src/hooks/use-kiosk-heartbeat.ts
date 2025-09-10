'use client';

import { getKioskUniqueId } from "@/lib/fingerprint";
import { useEffect } from "react";

const HEARTBEAT_INTERVAL = 15000;

export function useKioskHeartbeat({ enabled, kioskName }: { enabled: boolean, kioskName: string | null  }) {
    useEffect(() => {
        if (!enabled || !kioskName) return;

        let interval: NodeJS.Timeout | null = null;

        const startHeartbeat = async () => {
            try {
                const kioskId = await getKioskUniqueId();
                if (!kioskId) {
                    console.error("Impossible d'obtenir l'ID de la borne pour le heartbeat.");
                    return;
                }

                const sendHeartbeat = async () => {
                    try {
                        const response = await fetch(`/api/kiosks/${kioskId}/heartbeat`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ kioskName }),
                            keepalive: true,
                        });

                        if (response.ok) {
                            const data = await response.json();

                            if (data.forceLogout || data.forceRefresh) {
                                console.log(`Commande reçue du serveur: ${data.forceLogout ? 'Déconnexion' : 'Actualisation'}`);
                                window.location.reload();
                            }
                        } else {
                            /*if (response.status === 404) {
                                window.location.reload();
                            }*/
                        }
                    } catch (e) {
                        console.error("Erreur d'envoi du heartbeat", e);
                    }
                };

                sendHeartbeat();
                interval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
            } catch (error) {
                console.error("Échec du démarrage du heartbeat:", error);
            }
        };

        startHeartbeat();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [enabled, kioskName]);
}