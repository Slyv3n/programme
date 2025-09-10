"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Block } from "@prisma/client";
import { Resolver, useForm } from "react-hook-form";
import z from "zod";

const heroBlockSchema = z.object({
    title: z.string().default("Titre Principal"),
    subtitle: z.string().optional(),
    buttonText: z.string().optional(),
    buttonLink: z.string().optional(),
    backgroundImage: z.string().optional(),
    backgroundColor: z.string().default("#f8fafc"),
})

type FormValues = z.infer<typeof heroBlockSchema>

interface HeroBlockFormProps {
    block: Block;
    onSave: (newContent: FormValues) => void
}

export function HeroBlockForm({ block, onSave }: HeroBlockFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(heroBlockSchema) as Resolver<FormValues>,
        defaultValues: (block.content as any) || {
            title: "Titre Principal",
            subtitle: "",
            buttonText: "",
            buttonLink: "",
            backgroundImage: "",
            backgroundColor: "#f8fafc",
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
                            <FormLabel>Titre principal</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Votre titre principal"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sous-titre</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Description de votre section hero"
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
                        name="buttonText"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Texte du bouton</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Appel à l'action"
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
                    name="buttonLink"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Lien du bouton</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="/menu"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="backgroundImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image de fond (URL)</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://..."
                                    {...field}
                                />
                            </FormControl>
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
                                    className="h-10 p-1 w-full"
                                    type="color"
                                    {...field}
                                />
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