'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OptionGroup, Product, ProductOption } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OptionGroupForm } from "./OptionGroupForm";

type OptionGroupWithRelations = OptionGroup & { options: ProductOption[] };
type ProductWithRelations = Product & { customizationOptionGroups: OptionGroupWithRelations[] };

interface OptionGroupsManagerProps {
    product: ProductWithRelations;
}

export function OptionGroupsManager({ product }: OptionGroupsManagerProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<OptionGroupWithRelations | null>(null);

    const handleAdd = () => {
        setEditingGroup(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (group: OptionGroupWithRelations) => {
        setEditingGroup(group);
        setIsDialogOpen(true);
    };

    const onSave = () => {
        setIsDialogOpen(false);
        setEditingGroup(null);
        router.refresh();
    };

    const handleDelete = async (groupId: number) => {
        if (confirm("Voulez-vous vraiment supprimer ce groupe et toutes les options qu'il contient ?")) {
            try {
                const response = await fetch(`/api/option-groups/${groupId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error("La suppression a échoué.");
                router.refresh();
            } catch (error) {
                console.error(error);
                alert("Une erreur est survenue.");
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Groupes d&apos;Options</CardTitle>
                        <CardDescription>Gérez les choix comme les viandes, sauces ou cuissons.</CardDescription>
                    </div>
                    <Button onClick={handleAdd}>Ajouter un Groupe</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {product.customizationOptionGroups.map(group => (
                        <div className="border flex items-center justify-between p-4 rounded-md" key={group.id}>
                            <div>
                                <p className="font-semibold">{group.name}</p>
                                <div className="flex gap-2 items-center mt-1">
                                    <Badge variant="outline">{group.options.length} option(s)</Badge>
                                    {group.minChoices > 0 && <Badge>Requis</Badge>}
                                </div>
                            </div>
                            <div className="space-x-2">
                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                >
                                    <Link href={`/admin/option-groups/${group.id}`}>Gérer les options</Link>
                                </Button>
                                <Button
                                    onClick={() => handleEdit(group)}
                                    size="sm"
                                    variant="outline"
                                >
                                    Modifier
                                </Button>
                                <Button
                                    onClick={() => handleDelete(group.id)}
                                    size="sm"
                                    variant="destructive"
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </div>
                    ))}
                    {product.customizationOptionGroups.length === 0 && (
                        <p className="py-4 text-center text-muted-foreground text-sm">Aucun groupe d&apos;options pour ce produit.</p>
                    )}
                </div>
            </CardContent>

            <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingGroup ? `Modifier: ${editingGroup.name}` : "Nouveau groupe d'options"}</DialogTitle>
                    </DialogHeader>
                    <OptionGroupForm
                        group={editingGroup}
                        onSave={onSave}
                        productId={product.id}
                    />
                </DialogContent>
            </Dialog>
        </Card>
    );
}