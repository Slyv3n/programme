"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Block } from "@prisma/client";
import { Resolver, useForm } from "react-hook-form";
import z from "zod";

const ctaButtonSchema = z.object({
    text: z.string().min(1, "Le texte est requis."),
    link: z.string().min(1, "Le lien est requis."),
    variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link']).default('default'),
    size: z.enum(['sm', 'default', 'lg']).default('default'),
    alignment: z.enum(['left', 'center', 'right']).default('center'),
    openInNewTab: z.boolean().default(false),
})

type FormValues = z.infer<typeof ctaButtonSchema>

interface CtaButtonBlockFormProps {
    block: Block
    onSave: (newContent: FormValues) => void
}

export function CtaButtonBlockForm({ block, onSave }: CtaButtonBlockFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(ctaButtonSchema) as Resolver<FormValues>,
        defaultValues: (block.content as any) || {
            text: "Appel à l'action",
            link: "#",
            variant: "default",
            size: "default",
            alignment: "center",
            openInNewTab: false,
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
                    name="text"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Texte du bouton</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Cliquez ici"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lien</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="/contact"
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
                        name="variant"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Style</FormLabel>
                                <Select defaultValue={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="default">Défaut</SelectItem>
                                        <SelectItem value="destructive">Destructif</SelectItem>
                                        <SelectItem value="outline">Contour</SelectItem>
                                        <SelectItem value="secondary">Secondaire</SelectItem>
                                        <SelectItem value="ghost">Fantôme</SelectItem>
                                        <SelectItem value="link">Lien</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Taille</FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="sm">Petit</SelectItem>
                                    <SelectItem value="default">Normal</SelectItem>
                                    <SelectItem value="lg">Grand</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="alignment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Alignement</FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="left">Gauche</SelectItem>
                                    <SelectItem value="center">Centre</SelectItem>
                                    <SelectItem value="right">Droite</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="openInNewTab"
                    render={({ field }) => (
                        <FormItem className="border flex flex-row items-center justify-between p-3 rounded-lg shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel>Ouvrir dans un nouvel onglet</FormLabel>
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

                <Button disabled={!form.formState.isDirty} type="submit">Sauvegarder</Button>
            </form>
        </Form>
    )
}