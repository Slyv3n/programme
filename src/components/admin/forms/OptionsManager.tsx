'use client';

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OptionGroup, ProductOption, ProductSubOption } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OptionForm } from "./OptionForm";

type OptionWithSubOptions = ProductOption & { subOptions: ProductSubOption[] };
type GroupWithRelations = OptionGroup & { options: OptionWithSubOptions[] };

export function OptionsManager({ group }: { group: GroupWithRelations }) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingOption, setEditingOption] = useState<OptionWithSubOptions | null>(null);

    const handleAdd = () => {
        setEditingOption(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (option: OptionWithSubOptions) => {
        setEditingOption(option);
        setIsDialogOpen(true);
    };

    const onSave = () => {
        setIsDialogOpen(false);
        setEditingOption(null);
        router.refresh();
    };

    const handleDelete = async (optionId: number) => {
        if (confirm("Voulez-vous vraiment supprimer cette option ?")) {
            await fetch(`/api/options/${optionId}`, { method: 'DELETE' });
            router.refresh();
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={handleAdd}>Ajouter une Option</Button>
            </div>
            <div className="border rounded-md">
                {group.options.map(option => (
                    <div className="border-b flex items-center justify-between last:border-b-0 p-4" key={option.id}>
                        <div>
                            <p className="font-semibold">{option.name}</p>
                            <p className="text-muted-foreground text-sm">
                                {option.priceModifier ? `Supplément: ${option.priceModifier.toFixed(2)}€` : 'Pas de supplément'}
                            </p>
                        </div>
                        <div>
                            <Button
                                className="mr-2"
                                onClick={() => handleEdit(option)}
                                size="sm"
                                variant="outline"
                            >
                                Modifier
                            </Button>
                            <Button
                                onClick={() => handleDelete(option.id)}
                                size="sm"
                                variant="destructive"
                            >
                                Supprimer
                            </Button>
                        </div>
                    </div>
                ))}
                {group.options.length === 0 && (
                    <p className="p-4 text-center text-muted-foreground text-sm">Aucune option dans ce groupe.</p>
                )}
            </div>

            <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingOption ? `Modifier: ${editingOption.name}` : "Nouvelle Option"}</DialogTitle>
                    </DialogHeader>
                    <OptionForm onSave={onSave} option={editingOption} optionGroupId={group.id} />
                </DialogContent>
            </Dialog>
        </div>
    );
}