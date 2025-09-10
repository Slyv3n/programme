'use client';

import { LicenseTier } from "@prisma/client";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { toast } from "sonner";

export function LicenseGenerator() {
    const [tiers, setTiers] = useState<LicenseTier[]>([]);
    const [selectedTierId, setSelectedTierId] = useState<string>('');
    const [clientName, setClientName] = useState('');
    const [expiresAt, setExpiresAt] = useState<Date | undefined>();
    const [allowedDomain, setAllowedDomain] = useState('');
    const [generatedKey, setGeneratedKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchTiers() {
            try {
                const response = await fetch('/api/license-tiers');
                if (response.ok) {
                    const data = await response.json();
                    setTiers(data);
                }
            } catch {
                console.error("Impossible de charger les paliers de licence.");
            }
        }
        fetchTiers();
    }, []);

    const handleGenerate = async () => {
        if (!clientName || !selectedTierId) {
            toast("Veuillez renseigner le nom du client et choisir un palier.");
            return;
        }

        setIsLoading(true);
        setGeneratedKey('');

        try {
            const response = await fetch('/api/licenses/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clientName, tierId: selectedTierId, expiresAt, allowedDomain }),
            });

            if (!response.ok) throw new Error("La génération a échoué.");

            const newLicense = await response.json();
            setGeneratedKey(newLicense.id);
            toast("Licence générée avec succès !");
        } catch {
            toast("Une erreur est survenue.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border max-w-sm p-6 rounded-lg space-y-4">
            <div className="space-y-2">
                <Label htmlFor="client-name">Nom du client</Label>
                <Input
                    id="client-name"
                    onChange={e => setClientName(e.target.value)}
                    placeholder="Restaurant de la Plage"
                    value={clientName}            
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="tier-select">Palier de licence</Label>
                <Select onValueChange={setSelectedTierId}>
                    <SelectTrigger id="tier-select">
                        <SelectValue placeholder="Choisissez un palier..." />
                    </SelectTrigger>
                    <SelectContent>
                        {tiers.map(tier => (
                            <SelectItem key={tier.id} value={tier.id.toString()}>
                                {tier.name} ({tier.maxKiosks} borne(s))
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Date d&apos;expiration (optionnel)</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="font-normal justify-start text-left w-full" variant="outline">
                            <CalendarIcon className="h-4 mr-2 w-4" />
                            {expiresAt ? format(expiresAt, "PPP") : <span>Choisissez une date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto">
                        <Calendar initialFocus mode="single" onSelect={setExpiresAt} selected={expiresAt} />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <Label htmlFor="domain">Domaine Autorisé (optionnel)</Label>
                <Input
                    id="domain"
                    onChange={e => setAllowedDomain(e.target.value)}
                    placeholder="kiosk.mondomaine.com"
                    value={allowedDomain}
                />
            </div>

            <Button disabled={isLoading} onClick={handleGenerate}>
                {isLoading && <Loader2 className="animate-spin h-4 mr-2 w-4" />}
                {isLoading ? 'Génération...' : 'Générer la licence'}
            </Button>

            {generatedKey && (
                <div className="bg-gray-100 mt-4 p-4 rounded-md">
                    <p className="font-semibold">Clé générée pour {clientName} :</p>
                    <p className="font-bold font-mono text-lg break-all">{generatedKey}</p>
                </div>
            )}
        </div>
    );
}