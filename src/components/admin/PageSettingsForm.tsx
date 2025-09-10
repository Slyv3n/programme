"use client"

import { Page } from "@prisma/client"
import { Input } from "../ui/input"
import z from "zod"
import { Resolver, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

const pageSettingsSchema = z.object({
    name: z.string().min(1, "Le nom est requis."),
    backgroundType: z.enum(['color', 'image', 'video']).default('color'),
    backgroundValue: z.string().optional(),
    layoutType: z.string().default('single_column'),
})

type FormValues = z.infer<typeof pageSettingsSchema>

interface PageSettingsFormProps {
    page: Page
    onSave: () => void
}

export function PageSettingsForm({ page, onSave }: PageSettingsFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(pageSettingsSchema) as Resolver<FormValues>,
        defaultValues: {
            name: page.name || "",
            backgroundType: (page.backgroundType as FormValues['backgroundType']) || 'color',
            backgroundValue: page.backgroundValue || '#ffffff',
            layoutType: page.layoutType || 'single_column',
        }
    })

    const watchBgType = form.watch('backgroundType')

    const onSubmit = async (data: FormValues) => {
        try {
            const response = await fetch(`/api/pages/${page.id}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error("Erreur lors de la sauvegarde")

            toast.success("Paramètres de la page sauvegardés");
            onSave();
        } catch (error) {
            toast("Erreur lors de la sauvegarde")
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
                            <FormLabel>Nom de la page</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="layoutType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mise en page</FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="single_column">1 Colonne</SelectItem>
                                    <SelectItem value="two_columns">2 Colonnes</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="backgroundType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type de fond</FormLabel>
                            <FormControl>
                                <RadioGroup className="flex space-x-4" defaultValue={field.value} onValueChange={field.onChange}>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="color" />
                                        </FormControl>
                                        <FormLabel>Couleur</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="image" />
                                        </FormControl>
                                        <FormLabel>Image</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value="video" />
                                        </FormControl>
                                        <FormLabel>Vidéo</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="backgroundValue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{watchBgType === 'image' ? "URL de l'image" : watchBgType === 'video' ? "URL de la vidéo" : "Couleur"}</FormLabel>
                            <FormControl>
                                {watchBgType === 'color' ? (
                                    <Input
                                        className="h-10 p-1 w-full"
                                        type="color"
                                        {...field}
                                    />
                                ) : (
                                    <Input
                                        placeholder="https://..."
                                        {...field}
                                    />
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Sauvegarder</Button>
            </form>
        </Form>
    )
}