"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { zodResolver } from "@hookform/resolvers/zod"
import { Block } from "@prisma/client"
import { Resolver, useForm } from "react-hook-form"
import z from "zod"

const languageSwitcherSchema = z.object({
    alignment: z.enum(['start', 'center', 'end']).default('center'),
})

type FormValues = z.infer<typeof languageSwitcherSchema>

interface LanguageSwitcherBlockFormProps {
    block: Block;
    onSave: (newContent: FormValues) => void;
}

export function LanguageSwitcherBlockForm({ block, onSave }: LanguageSwitcherBlockFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(languageSwitcherSchema) as Resolver<FormValues>,
        defaultValues: (block.content as any) || {
            alignment: 'center',
        },
    });

    const onSubmit = (data: FormValues) => {
        onSave(data)
    };

    return <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
                control={form.control}
                name="alignment"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Alignement</FormLabel>
                        <FormControl>
                            <RadioGroup className="flex space-x-4" defaultValue={field.value} onValueChange={field.onChange}>
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <RadioGroupItem value="start" />
                                    </FormControl>
                                    <FormLabel>Gauche</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <RadioGroupItem value="center" />
                                    </FormControl>
                                    <FormLabel>Centre</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <RadioGroupItem value="end" />
                                    </FormControl>
                                    <FormLabel>Droite</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                    </FormItem>
                )}
            />
            <Button type="submit">Enregistrer</Button>
        </form>
    </Form>
}