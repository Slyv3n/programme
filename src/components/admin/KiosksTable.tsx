'use client';

import { Kiosk } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

type KioskWithStatus = Kiosk & { isOnline: boolean };

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function KiosksTable() {
  const { data: kiosks, error, isLoading, mutate } = useSWR<KioskWithStatus[]>('/api/licenses/kiosks', fetcher, {
    refreshInterval: 5000,
  });

  const [refreshingKioskId, setRefreshingKioskId] = useState<string | null>(null);

  const handleToggleInactivity = async (kiosk: Kiosk) => {
    mutate(kiosks?.map(k => k.id === kiosk.id ? { ...k, inactivityTimeoutEnabled: !k.inactivityTimeoutEnabled } : k), false);

    await fetch(`/api/kiosks/${kiosk.id}/toggle-inactivity`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !kiosk.inactivityTimeoutEnabled }),
    });
    mutate();
  };

  const handleBlacklist = async (kioskId: string) => {
    mutate(kiosks?.map(k => k.id === kioskId ? { ...k, isBlacklisted: true } : k), false);

    try {
      const response = await fetch(`/api/kiosks/${kioskId}/blacklist`, { method: 'POST' });
      if (!response.ok) throw new Error("Échec de l'opération.");
      toast("La borne a été bannie de cette licence.");
    } catch {
      toast("Erreur");
    } finally {
      mutate();
    }
  };

  const handleForceLogout = async (kioskId: string) => {
    mutate(kiosks?.filter(k => k.id !== kioskId), { revalidate: false });
    await fetch(`/api/kiosks/${kioskId}/logout`, { method: 'POST' });
    toast("L'ordre de déconnexion a été envoyé.");
  };

  const handleForceRefresh = async (kioskId: string) => {
    setRefreshingKioskId(kioskId);
    await fetch(`/api/kiosks/${kioskId}/refresh`, { method: 'POST' });
    toast("L'ordre d'actualisation a été envoyé.");
    setTimeout(() => setRefreshingKioskId(null), 2000);
  };

  if (isLoading) return <p className="p-8 text-center text-muted-foreground">Chargement des bornes...</p>;
  if (error) return <p className="p-8 text-center text-red-500">Erreur de chargement des données.</p>;

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom de la borne</TableHead>
            <TableHead>Identifiant Machine</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Timer d&apos;Inactivité</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {kiosks?.map((kiosk) => {
            const isRefreshing = refreshingKioskId === kiosk.id;
            const isOnline = (new Date().getTime() - new Date(kiosk.lastHeartbeat).getTime()) / 1000 < 30;

            return (
              <TableRow key={kiosk.id} className={kiosk.isBlacklisted ? 'bg-red-50 text-muted-foreground' : ''}>
                <TableCell className="font-medium">{kiosk.name}</TableCell>
                <TableCell className="font-mono text-xs">{kiosk.id}</TableCell>
                <TableCell>
                  {kiosk.isBlacklisted ? (
                    <Badge variant="destructive">Bannie</Badge>
                  ) : kiosk.isOnline ? (
                    <Badge className="bg-green-500 hover:bg-green-500">En ligne</Badge>
                  ) : (
                    <Badge variant="secondary">Hors ligne</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={kiosk.inactivityTimeoutEnabled}
                    disabled={kiosk.isBlacklisted}
                    onCheckedChange={() => handleToggleInactivity(kiosk)}
                  />
                </TableCell>
                <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleForceRefresh(kiosk.id)} disabled={!isOnline || isRefreshing || kiosk.isBlacklisted}>
                    {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Actualiser'}
                  </Button>
                    <Button variant="outline" size="sm" onClick={() => handleForceLogout(kiosk.id)} disabled={!isOnline || kiosk.isBlacklisted}>
                    Déconnecter
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" disabled={kiosk.isBlacklisted}>Bannir</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bannir cette borne ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action empêchera définitivement cet appareil de se reconnecter à la licence actuelle.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleBlacklist(kiosk.id)}>Confirmer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
        {kiosks?.length === 0 && (
        <p className="p-8 text-center text-muted-foreground">Aucune borne n&apos;est enregistrée pour la licence active.</p>
      )}
    </div>
  );
}