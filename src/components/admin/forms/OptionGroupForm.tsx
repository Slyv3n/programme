'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { optionGroupSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { OptionGroup } from "@prisma/client";
import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";

type FormValues = z.infer<typeof optionGroupSchema>;

interface OptionGroupFormProps {
    group?: OptionGroup | null;
    onSave: () => void;
    productId: number;
}

export function OptionGroupForm({ productId, group, onSave }: OptionGroupFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(optionGroupSchema) as Resolver<FormValues>,
        defaultValues: {
            name: group?.name || "",
            position: group?.position || 10,
            minChoices: group?.minChoices || 0,
            maxChoices: group?.maxChoices || 1,
            allowQuantity: group?.allowQuantity || false,
        },
    });

    const onSubmit = async (data: FormValues) => {
        const apiEndpoint = group ? `/api/option-groups/${group.id}` : '/api/option-groups';
        const method = group ? 'PUT' : 'POST';

        try {
            await fetch(apiEndpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, productId }),
            });
            onSave();
        } catch (error) {
            console.error(error);
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
                            <FormLabel>Nom du groupe</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: Choix de la Viande"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    {...field}
                                    value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormDescription>Ordre d&apos;affichage (1, 2, 3...).</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="gap-4 grid grid-cols-2">
                    <FormField
                        control={form.control}
                        name="minChoices"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Choix minimum</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>Mettre 0 pour optionnel, 1 ou plus pour obligatoire.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="maxChoices"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Choix maximum</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="allowQuantity"
                    render={({ field }) => (
                        <FormItem className="border flex flex-row items-center justify-between p-3 rounded-lg shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Autoriser les quantités</FormLabel>
                                <FormDescription>Le client peut-il choisir plusieurs fois la même option (avec +/-) ?</FormDescription>
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

                <Button
                    disabled={form.formState.isSubmitting}
                    type="submit"
                >
                    {form.formState.isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
            </form>
        </Form>
    );
}