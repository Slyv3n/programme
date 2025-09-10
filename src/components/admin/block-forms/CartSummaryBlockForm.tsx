"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Block } from "@prisma/client"
import { Resolver, useForm } from "react-hook-form"
import z from "zod"

const cartSummarySchema = z.object({
    position: z.enum(['left', 'right', 'center']).default('right'),
    height: z.enum(['full', 'auto']).default('full'),
    width: z.string().default('w-96'),
    backgroundColor: z.string().default('bg-white'),
    borderRadius: z.string().default('rounded-none'),
    shadow: z.boolean().default(true),
})

type FormValues = z.infer<typeof cartSummarySchema>;

interface CartSummaryBlockFormProps {
    block: Block
    onSave: (newContent: FormValues) => void
}

export function CartSummaryBlockForm({ block, onSave }: CartSummaryBlockFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(cartSummarySchema) as Resolver<FormValues>,
        defaultValues: (block.content as any) || {
            position: 'right',
            height: 'full',
            width: 'w-96',
            backgroundColor: 'bg-white',
            borderRadius: 'rounded-none',
            shadow: true,
        },
    })

    const onSubmit = (data: FormValues) => {
        onSave(data)
    }

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Position</FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="left">Gauche</SelectItem>
                                    <SelectItem value="right">Droite</SelectItem>
                                    <SelectItem value="center">Centre</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hauteur</FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="full">Pleine hauteur</SelectItem>
                                    <SelectItem value="auto">Automatique</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="width"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Largeur</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: w-96 ou w-full"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Classe Tailwind pour la largeur.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="backgroundColor"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Couleur de fond</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: bg-gray-50"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Classe Tailwind pour le fond.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="borderRadius"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Arrondi des bords</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Ex: rounded-lg"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Classe Tailwind pour l'arrondi.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shadow"
                    render={({ field }) => (
                        <FormItem className="border flex flex-row items-center justify-between p-3 rounded-lg shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Ombre</FormLabel>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button disabled={!form.formState.isDirty} type="submit">Sauvegarder</Button>
            </form>
        </Form>
    )
}