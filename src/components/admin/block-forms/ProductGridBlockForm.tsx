"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Block } from "@prisma/client"
import { Resolver, useForm } from "react-hook-form"
import z from "zod"

const productGridSchema = z.object({
    title: z.string().optional(),
    columns: z.coerce.number().min(2).max(3).default(3),
    showPrices: z.boolean().default(true),
    showNames: z.boolean().default(true),
    showImages: z.boolean().default(true),
    showBorders: z.boolean().default(true),
    category: z.string().default("all"),
    borderRadius: z.string().optional(),
    borderColor: z.string().optional(),
})

type FormValues = z.infer<typeof productGridSchema>

interface ProductGridBlockFormProps {
    block: Block
    onSave: (newContent: FormValues) => void
}

export function ProductGridBlockForm({ block, onSave }: ProductGridBlockFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(productGridSchema) as Resolver<FormValues>,
        defaultValues: (block.content as any) || {
            title: "",
            columns: 3,
            showPrices: true,
            showNames: true,
            showImages: true,
            showBorders: true,
            category: "all",
            borderRadius: "",
            borderColor: "",
        }
    })

    const onSubmit = (data: FormValues) => {
        onSave(data)
    }

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titre de la section</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Nos Produits"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="gap-4 grid grid-cols-2">
                    <FormField
                        control={form.control}
                        name="columns"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre de colonnes</FormLabel>
                                <Select defaultValue={String(field.value)} onValueChange={(value) => field.onChange(parseInt(value))}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="2">2 colonnes</SelectItem>
                                        <SelectItem value="3">3 colonnes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Catégorie à afficher</FormLabel>
                                <Select defaultValue={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les produits</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="showPrices"
                        render={({ field }) => (
                            <FormItem className="border flex flex-row items-center justify-between p-3 rounded-lg shadow-sm">
                                <FormLabel>Afficher les prix</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="showNames"
                        render={({ field }) => (
                            <FormItem className="border flex flex-row items-center justify-between p-3 rounded-lg shadow-sm">
                                <FormLabel>Afficher les noms</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="showImages"
                        render={({ field }) => (
                            <FormItem className="border flex flex-row items-center justify-between p-3 rounded-lg shadow-sm">
                                <FormLabel>Afficher les images</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="showBorders"
                        render={({ field }) => (
                            <FormItem className="border flex flex-row items-center justify-between p-3 rounded-lg shadow-sm">
                                <FormLabel>Afficher les bordures</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="gap-4 grid grid-cols-2">
                        <FormField
                            control={form.control}
                            name="borderRadius"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Arrondi des bords</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: rounded-xl"
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="borderColor"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Couleur de la bordure</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: border-gray-200"
                                            {...field}
                                            value={field.value ?? ''}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button type="submit">Sauvegarder</Button>
                </div>
            </form>
        </Form>
    )
}