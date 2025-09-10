'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { productSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Resolver, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import { z } from "zod";

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    onSave?: () => void;
    product?: Product | null;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function ProductForm({ product, onSave }: ProductFormProps) {
    const router = useRouter();
    const { data: categories } = useSWR<Category[]>('/api/categories', fetcher);

    const [submitAction, setSubmitAction] = useState<'save' | 'saveAndCustomize'>('save');

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema) as Resolver<ProductFormValues>,
        defaultValues: {
            name: product?.name || "",
            price: product?.price ?? undefined,
            categoryId: product?.categoryId ?? undefined,
            description: product?.description || "",
            imageUrl: product?.imageUrl || "",
            isAvailable: product?.isAvailable ?? true,
            pointCost: product?.pointCost ?? undefined,
            calories: product?.calories ?? undefined,
            allergens: product?.allergens || "",
        },
    });

    const watchedPointCost = useWatch({ control: form.control, name: 'pointCost' });
    const watchedPrice = useWatch({ control: form.control, name: 'price' });

    const onSubmit = async (data: ProductFormValues) => {
        const apiEndpoint = product ? `/api/products/${product.id}` : '/api/products';
        const method = product ? 'PUT' : 'POST';

        try {
            const response = await fetch(apiEndpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const savedProduct = await response.json();
                await fetch('/api/revalidate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ path: '/menu' })
                });

                toast(product ? "Produit mis à jour." : "Produit créé.");

                if (submitAction === 'saveAndCustomize' && !product) {
                    router.push(`/admin/products/${savedProduct.id}`);
                } else if (onSave) {
                    onSave();
                    router.refresh();
                } else {
                    router.refresh();
                }
            } else {
                const errorData = await response.json();
                form.setError('name', {
                    message: errorData.error || "Une erreur est survenue.",
                    type: 'server',
                });
            }
        } catch (error) {
            console.error(error);
            toast("Une erreur de communication est survenue.");
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom du produit</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Catégorie</FormLabel>
                            <Select
                                defaultValue={field.value?.toString()}
                                onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez une catégorie" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories?.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optionnel)</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>URL de l&apos;image (Optionnel)</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="gap-4 grid grid-cols-2">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prix (€)</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={!!watchedPointCost && watchedPointCost > 0}
                                        step="0.01"
                                        type="number"
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pointCost"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Coût en Points</FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={!!watchedPrice && watchedPrice > 0}
                                        type="number"
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                </FormControl>
                                <FormDescription>Optionnel</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="gap-4 grid grid-cols-2">
                    <FormField
                        control={form.control}
                        name="calories"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Calories (kcal)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="allergens"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Allergènes</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Gluten, Lait..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                        <FormItem className="border flex flex-row items-center justify-between p-3 rounded-lg shadow-sm">
                            <div>
                                <FormLabel>Produit Disponible</FormLabel>
                                <FormDescription>Le produit sera visible par les clients.</FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex gap-2 justify-end pt-4">
                    {product ? (
                        <Button disabled={form.formState.isSubmitting || !form.formState.isDirty} type="submit">
                            {form.formState.isSubmitting ? "Sauvegarde..." : "Enregistrer les modifications"}
                        </Button>
                    ) : (
                        <>
                            <Button
                                disabled={form.formState.isSubmitting}
                                onClick={() => setSubmitAction('save')}
                                type="submit"
                                variant="outline"
                            >
                                {form.formState.isSubmitting && submitAction === 'save' ? "Sauvegarde..." : "Sauvegarder"}
                            </Button>
                            <Button
                                disabled={form.formState.isSubmitting}
                                onClick={() => setSubmitAction('saveAndCustomize')}
                                type="submit"
                            >
                                {form.formState.isSubmitting && submitAction === 'saveAndCustomize' ? "Sauvegarde..." : "Sauvegarder et Personnaliser"}
                            </Button>
                        </>
                    )}
                </div>
            </form>
        </Form>
    );
}