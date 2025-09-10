"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Block } from "@prisma/client"
import { Resolver, useForm } from "react-hook-form"
import z from "zod"

const textBlockSchema = z.object({
    title: z.string().optional(),
    titleSize: z.enum(['h1', 'h2', 'h3', 'h4']).default('h2'),
    content: z.string().optional(),
    alignment: z.enum(['left', 'center', 'right']).default('left'),
})

type FormValues = z.infer<typeof textBlockSchema>;

interface TextBlockFormProps {
    block: Block
    onSave: (newContent: FormValues) => void
}

export function TextBlockForm({ block, onSave }: TextBlockFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(textBlockSchema) as Resolver<FormValues>,
        defaultValues: (block.content as any) || {
            title: "",
            titleSize: "h2",
            content: "",
            alignment: "left",
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
                            <FormLabel>Titre (optionnel)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Titre du bloc"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="titleSize"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Taille du titre</FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger />
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="h1">H1 (Très grand)</SelectItem>
                                    <SelectItem value="h2">H2 (Grand)</SelectItem>
                                    <SelectItem value="h3">H3 (Moyen)</SelectItem>
                                    <SelectItem value="h4">H4 (Petit)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contenu</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Contenu du bloc texte"
                                    rows={6}
                                    {...field}
                                />
                            </FormControl>
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

                <Button disabled={!form.formState.isDirty || form.formState.isSubmitting} type="submit">
                    {form.formState.isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
            </form>
        </Form>
    )
}