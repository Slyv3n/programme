'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ingredientSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type FormValues = z.infer<typeof ingredientSchema>;

interface IngredientFormProps {
    ingredientGroupId: number;
    onSave: () => void;
}

export function IngredientForm({ ingredientGroupId, onSave }: IngredientFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(ingredientSchema) as Resolver<FormValues>,
        defaultValues: {
            name: "",
            isRemovable: true,
            addPrice: undefined,
        },
    });

    const onSubmit = async (data: FormValues) => {
        try {
            const response = await fetch('/api/ingredients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, ingredientGroupId }),
            });

            if (!response.ok) throw new Error("L'ajout a échoué.");

            toast("Ingrédient ajouté.");
            form.reset();
            onSave();
        } catch {
            toast("Une erreur est survenue.");
        }
    };

    return (
        <Form {...form}>
            <form className="border-t p-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <h4 className="font-semibold">Ajouter un ingrédient</h4>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom de l&apos;ingrédient</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: Cornichons"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="addPrice"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prix en supplément (optionnel)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="0.30"
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
                    name="isRemovable"
                    render={({ field }) => (
                        <FormItem className="border flex flex-row items-center justify-between p-3 rounded-lg shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Peut être retiré</FormLabel>
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
                <Button disabled={form.formState.isSubmitting} size="sm" type="submit">
                    {form.formState.isSubmitting ? "Ajout..." : "Ajouter"}
                </Button>
            </form>
        </Form>
    );
}