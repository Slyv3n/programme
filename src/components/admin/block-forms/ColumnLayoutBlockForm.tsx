"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { Block } from "@prisma/client"
import { Resolver, useForm } from "react-hook-form"
import z from "zod"

const columnLayoutSchema = z.object({
    layout: z.string().default("6-6"),
})

type FormValues = z.infer<typeof columnLayoutSchema>

interface ColumnLayoutBlockFormProps {
    block: Block
    onSave: (data: FormValues) => void
}

export function ColumnLayoutBlockForm({ block, onSave }: ColumnLayoutBlockFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(columnLayoutSchema) as Resolver<FormValues>,
        defaultValues: (block.content as any) || {
            layout: "6-6"
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
                    name="layout"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Configuration des colonnes</FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="6-6">2 Colonnes (50% / 50%)</SelectItem>
                                    <SelectItem value="4-8">2 Colonnes (33% / 67%)</SelectItem>
                                    <SelectItem value="8-4">2 Colonnes (67% / 33%)</SelectItem>
                                    <SelectItem value="4-4-4">3 Colonnes (33% / 33% / 33%)</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <Button type="submit">Sauvegarder</Button>
            </form>
        </Form>
    )
}