'use client';

import { Category } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SortableTableHeader } from "./SortableTableHeader";
import { useDebouncedCallback } from "use-debounce";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function CategoriesTable() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const query = searchParams.get('query') || '';
    const sortBy = searchParams.get('sortBy') || 'position';
    const order = searchParams.get('order') || 'asc';

    const apiUrl = `/api/categories?sortBy=${sortBy}&order=${order}&query=${query}`;
    const { data: categories, error, isLoading, mutate } = useSWR<Category[]>(apiUrl, fetcher);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryPosition, setNewCategoryPosition] = useState('10');

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleSave = async () => {
        if (!newCategoryName.trim()) return;
        await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: newCategoryName,
                position: parseInt(newCategoryPosition)
            }),
        });
        setIsDialogOpen(false);
        setNewCategoryName('');
        mutate();
    };

    if (isLoading) return <p className="p-8 text-center text-muted-foreground">Chargement des catégories...</p>;
    if (error) return <p className="p-8 text-center text-red-500">Erreur de chargement des données.</p>;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <Input
                    className="max-w-sm"
                    defaultValue={searchParams.get('query') || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Rechercher une catégorie..."
                />
                <Button
                    onClick={() => setIsDialogOpen(true)}
                >
                    Nouvelle Catégorie
                </Button>
            </div>
            <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Créer une catégorie</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 mt-4">
                        <Input
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Nom de la catégorie"
                            value={newCategoryName}
                        />
                        <Input
                            onChange={(e) => setNewCategoryPosition(e.target.value)}
                            placeholder="Position"
                            type="number"
                            value={newCategoryPosition}
                        />
                        <Button onClick={handleSave}>Enregistrer</Button>
                    </div>
                </DialogContent>
            </Dialog>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <SortableTableHeader columnName="name" label="Nom" />
                            </TableHead>
                            <TableHead>
                                <SortableTableHeader columnName="position" label="Position" />
                            </TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories?.map((cat) => (
                            <TableRow key={cat.id}>
                                <TableCell className="font-medium">{cat.name}</TableCell>
                                <TableCell>{cat.position}</TableCell>
                                <TableCell className="text-right">
                                    <Button
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