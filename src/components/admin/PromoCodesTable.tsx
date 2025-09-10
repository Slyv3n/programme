'use client';

import { PromoCode } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { PromoCodeForm } from "./PromoCodeForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function PromoCodesTable() {
    const { data: promoCodes, mutate } = useSWR<PromoCode[]>('/api/promo-codes', fetcher);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const onSave = () => {
        setIsDialogOpen(false);
        mutate();
    };

    const handleDelete = async (id: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce code promo ?")) {
            await fetch(`/api/promo-codes/${id}`, { method: 'DELETE' });
            mutate();
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsDialogOpen(true)}>Créer un code</Button>
            </div>
            <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nouveau Code Promo</DialogTitle>
                    </DialogHeader>
                    <PromoCodeForm onSave={onSave} />
                </DialogContent>
            </Dialog>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Valeur</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {promoCodes?.map((pc) => (
                            <TableRow key={pc.id}>
                                <TableCell className="font-bold">{pc.code}</TableCell>
                                <TableCell>{pc.discountType === 'percentage' ? 'Pourcentage' : 'Montant Fixe'}</TableCell>
                                <TableCell>{pc.discountType === 'percentage' ? `${pc.value}%` : `${pc.value.toFixed(2)}€`}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        onClick={() => handleDelete(pc.id)}
                                        size="sm"
                                        variant="destructive"
                                    >
                                        Supprimer
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}