'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { optionSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductOption } from "@prisma/client";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FormValues = z.infer<typeof optionSchema>;

interface OptionFormProps {
    onSave: () => void;
    option?: ProductOption | null;
    optionGroupId: number;
}

export function OptionForm({ optionGroupId, option, onSave }: OptionFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(optionSchema) as Resolver<FormValues>,
        defaultValues: {
            name: option?.name || "",
            priceModifier: option?.priceModifier || undefined,
        },
    });

    const onSubmit = async (data: FormValues) => {
        const apiEndpoint = option ? `/api/options/${option.id}` : '/api/options';
        const method = option ? 'PUT' : 'POST';

        try {
            const response = await fetch(apiEndpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, optionGroupId }),
            });

            if (response.ok) {
                toast("Option sauvegardé.");
                onSave();
            } else {
                const errorData = await response.json();
                form.setError("name", {
                    message: errorData.error || "Une erreur est survenue.",
                    type: "server"
                });
            }
        } catch (error) {
            console.error(error);
            toast("Erreur de communication avec le serveur.");
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nom de l&apos;option</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Poulet"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="priceModifier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Supplément de prix</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="0.50"
                                    step="0.01"
                                    type="number"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Laissez vide si pas de supplément.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={form.formState.isSubmitting}
                    type="submit"
                >
                    Sauvegarder
                </Button>
            </form>
        </Form>
    )
}