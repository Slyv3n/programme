'use client';

import { Category, Product } from "@prisma/client";
import { useState } from "react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ProductForm } from "./ProductForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Copy, Loader2 } from "lucide-react";
import { SortableTableHeader } from "./SortableTableHeader";
import { useDebouncedCallback } from "use-debounce";

type ProductWithCategory = Product & { category: Category };

const BulkActions = ({ selectedIds, onActionComplete }: { selectedIds: number[], onActionComplete: () => void }) => {
    const [updateType, setUpdateType] = useState<'percentage' | 'fixed'>('percentage');
    const [value, setValue] = useState('');

    const handlePriceUpdate = async () => {
        if (!value || selectedIds.length === 0) {
            toast("Veuillez entrer une valeur.");
            return;
        }

        try {
            const response = await fetch('/api/products/bulk-price-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productIds: selectedIds, updateType, value }),
            });
            if (!response.ok) throw new Error("La mise à jour a échoué.");

            toast(`${selectedIds.length} produit(s) mis à jour avec succès.`);
            onActionComplete();
        } catch {
            toast("Une erreur est survenue.");
        }
    };

    const handleStatusUpdate = async (isAvailable: boolean) => {
        try {
            const response = await fetch('/api/products/bulk-status-update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productIds: selectedIds, isAvailable }),
            });
            if (!response.ok) throw new Error("La mise à jour a échoué.");

            toast(`Statut de ${selectedIds.length} produit(s) mis à jour.`);
            onActionComplete();
        } catch {
            toast("Une erreur est survenue.");
        }
    }

    return (
        <div className="animate-in bg-gray-50 border fade-in-50 flex gap-4 items-center p-4 rounded-md">
            <div className="flex gap-4 items-center">
                <p className="font-bold">{selectedIds.length} produit(s) sélectionné(s)</p>
                <Select onValueChange={(value: string) => setUpdateType(value as 'percentage' | 'fixed')} value={updateType}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="percentage">Augmentation (%)</SelectItem>
                        <SelectItem value="fixed">Augmentation (€)</SelectItem>
                    </SelectContent>
                </Select>
                <Input
                    className="w-24"
                    onChange={e => setValue(e.target.value)}
                    placeholder="Valeur"
                    type="number"
                    value={value}
                />
                <Button onClick={handlePriceUpdate}>Appliquer</Button>
            </div>

            <div className="flex gap-2 items-center">
                <Button onClick={() => handleStatusUpdate(true)} variant="outline">Activer la sélection</Button>
                <Button onClick={() => handleStatusUpdate(false)} variant="destructive">Désactiver la sélection</Button>
            </div>
        </div>
    );
};

export function ProductTable({ products }: { products: ProductWithCategory[] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [duplicatingProductId, setDuplicatingProductId] = useState<number | null>(null);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    const handleSelectAll = (checked: boolean) => {
        setSelectedProductIds(checked ? products.map(p => p.id) : []);
    };

    const handleSelectRow = (productId: number, checked: boolean) => {
        if (checked) {
            setSelectedProductIds(prev => [...prev, productId]);
        } else {
            setSelectedProductIds(prev => prev.filter(id => id !== productId));
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsDialogOpen(true);
    }

    const handleAdd = () => {
        setEditingProduct(null);
        setIsDialogOpen(true);
    };

    const onSave = () => {
        setIsDialogOpen(false);
        setEditingProduct(null);
        router.refresh();
    };

    const handleDelete = async (productId: number) => {
        console.log(`Tentative de suppression du produit avec l'ID: ${productId}`);

        try {
            const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' });

            console.log('Réponse du serveur:', response.status, response.statusText);

            if (!response.ok) throw new Error("La suppression a échoué.");

            toast("Le produit a été supprimé.");
            router.refresh();
        } catch (error) {
            console.error("Erreur dans la fonction handleDelete:", error);
            toast("Une erreur est survenue.");
        }
    };

    const handleDuplicate = async (productId: number) => {
        setDuplicatingProductId(productId);
        try {
            const response = await fetch(`/api/products/${productId}/duplicate`, { method: 'POST' });
            if (!response.ok) throw new Error("La duplication a échoué.");

            toast("Le produit a été dupliqué avec succès.");
            router.refresh();
        } catch {
            toast("Une erreur est survenue.");
        } finally {
            setDuplicatingProductId(null);
        }
    };

    return (
        <div>
            {selectedProductIds.length > 0 && (
                <div className="mb-4">
                    <BulkActions
                        onActionComplete={() => {
                            setSelectedProductIds([]);
                            router.refresh();
                        }}
                        selectedIds={selectedProductIds}
                    />
                </div>
            )}

            <div className="flex items-center justify-between mb-4">
                <Input
                    className="max-w-sm"
                    defaultValue={searchParams.get('query') || ''}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Rechercher un produit ou une catégorie..."
                />
                <Button onClick={handleAdd}>Ajouter un Produit</Button>
            </div>

            <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</DialogTitle>
                    </DialogHeader>
                    <ProductForm onSave={onSave} product={editingProduct} />
                </DialogContent>
            </Dialog>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40px]">
                                <Checkbox
                                    checked={selectedProductIds.length === products.length && products.length > 0}
                                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                                />
                            </TableHead>
                            <TableHead>
                                <SortableTableHeader columnName="name" label="Nom" />
                            </TableHead>
                            <TableHead>
                                <SortableTableHeader columnName="category" label="Catégorie" />
                            </TableHead>
                            <TableHead>
                                <SortableTableHeader columnName="price" label="Prix" />
                            </TableHead>
                            <TableHead>Disponible</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => {
                            const isDuplicating = duplicatingProductId === product.id;

                            return (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedProductIds.includes(product.id)}
                                            onCheckedChange={(checked) => handleSelectRow(product.id, Boolean(checked))}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.category.name}</TableCell>
                                    <TableCell>{product.price.toFixed(2)} €</TableCell>
                                    <TableCell>
                                        {product.isAvailable ? (
                                            <Badge variant="secondary">Oui</Badge>
                                        ) : (
                                            <Badge variant="destructive">Non</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="space-x-2 text-right">
                                        <Button
                                            disabled={isDuplicating}
                                            onClick={() => handleDuplicate(product.id)}
                                            size="sm"
                                            variant="outline"
                                        >
                                            {isDuplicating ? (
                                                <Loader2 className="animate-spin h-4 w-4" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                        >
                                            <Link href={`/admin/products/${product.id}`}>Gérer options</Link>
                                        </Button>
                                        <Button
                                            onClick={() => handleEdit(product)}
                                            size="sm"
                                            variant="outline"
                                        >
                                            Modifier
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                >
                                                    Supprimer
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action est irréversible et supprimera définitivement le produit {product.name}.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(product.id)}>Confirmer la suppression</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            {products.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                    Aucun produit trouvé. Cliquez sur Ajouter un Produit pour commencer.
                </div>
            )}
        </div>
    );
}