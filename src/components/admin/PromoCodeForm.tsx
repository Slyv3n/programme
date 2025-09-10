'use client';

import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

const promoCodeSchema = z.object({
    code: z.string().min(3, "Le code doit faire au moins 3 caractères."),
    discountType: z.enum(['percentage', 'fixed']),
    value: z.coerce.number().positive("La valeur doit être positive."),
});

type FormValues = z.infer<typeof promoCodeSchema>;

export function PromoCodeForm({ onSave }: { onSave: () => void }) {
    const form = useForm<FormValues>({
        resolver: zodResolver(promoCodeSchema) as Resolver<FormValues>,
        defaultValues: {
            code: "",
            discountType: 'percentage',
            value: undefined,
        },
    });

    const onSubmit = async (data: FormValues) => {
        const response = await fetch('/api/promo-codes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            onSave();
        } else {
            const errorData = await response.json();
            form.setError('code', {
                message: errorData.error || "Une erreur est survenue.",
                type: 'server',
            });
        }
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="SUMMER10"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="discountType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type de réduction</FormLabel>
                            <Select
                                defaultValue={field.value}
                                onValueChange={field.onChange}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                                    <SelectItem value="fixed">Montant fixe (€)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Valeur</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="10"
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
                <Button type="submit">Créer le code</Button>
            </form>
        </Form>
    );
}