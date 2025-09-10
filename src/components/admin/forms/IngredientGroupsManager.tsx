'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Ingredient, IngredientGroup, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IngredientForm } from "./IngredientForm";

type IngredientGroupWithItems = IngredientGroup & { items: Ingredient[] };
type ProductWithRelations = Product & { ingredientGroups: IngredientGroupWithItems[] };

export function IngredientGroupsManager({ product }: { product: ProductWithRelations }) {
    const router = useRouter();
    const [newGroupName, setNewGroupName] = useState('');

    const handleAddGroup = async () => {
        if (!newGroupName.trim()) return;
        await fetch('/api/ingredient-groups', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newGroupName, productId: product.id }),
        });
        setNewGroupName('');
        router.refresh();
    };

    const handleDeleteGroup = async (groupId: number) => {
        if (confirm("Supprimer ce groupe et tous ses ingrédients ?")) {
            await fetch(`/api/ingredient-groups/${groupId}`, { method: 'DELETE' });
            router.refresh();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Groupes d&apos;Ingrédients</CardTitle>
                <CardDescription>Gérez les ingrédients inclus dans le produit.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {product.ingredientGroups.map(group => (
                        <div className="border p-4 rounded-md" key={group.id}>
                            <div className="flex items-center justify-between mb-4">
                                <p className="font-semibold">{group.name}</p>
                                <Button
                                    onClick={() => handleDeleteGroup(group.id)}
                                    size="sm"
                                    variant="destructive"
                                >
                                    Supprimer Groupe
                                </Button>
                            </div>

                            <div className="mb-4 space-y-2">
                                {group.items.map(item => (
                                    <div
                                        className="flex items-center justify-between text-sm"
                                        key={item.id}
                                    >
                                        <span>{item.name}</span>
                                        <Button size="sm" variant="ghost">X</Button>
                                    </div>
                                ))}
                            </div>

                            <IngredientForm ingredientGroupId={group.id} onSave={() => router.refresh()} />
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-6">
                    <Input
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Nom du nouveau groupe (ex: Garnitures)"
                        value={newGroupName} 
                    />
                    <Button onClick={handleAddGroup}>Ajouter Groupe</Button>
                </div>
            </CardContent>
        </Card>
    )
}