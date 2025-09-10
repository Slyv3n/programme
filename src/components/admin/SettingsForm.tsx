'use client';

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import useSWR from "swr";
import { Page } from "@prisma/client";

// On définit un schéma de validation pour les données du formulaire
const settingsSchema = z.object({
  activeTheme: z.string(),
  homepageSlug: z.string().optional(),
  licenseKey: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialSettings: {
    activeTheme: string;
    homepageSlug: string;
    licenseKey: string;
  };
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const { data: pages } = useSWR<Page[]>('/api/pages', fetcher);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialSettings,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("La sauvegarde a échoué.");
      }
      
      toast("Paramètres enregistrés. L'application va se recharger.");

      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch {
      toast("Impossible d'enregistrer les paramètres.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <FormField
          control={form.control}
          name="licenseKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clé de Licence</FormLabel>
              <FormControl>
                <Input placeholder="Entrez la clé de licence..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="activeTheme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thème de l&apos;application</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez un thème..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="default">Fast-Food (Défaut)</SelectItem>
                  <SelectItem value="theme-bakery">Boulangerie</SelectItem>
                  <SelectItem value="theme-butcher">Boucherie</SelectItem>
                  <SelectItem value="theme-debug">Debug (Test)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <h3 className="font-medium text-lg">Page d'accueil</h3>
        <FormField
          control={form.control}
          name="homepageSlug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page à afficher à la racine du site</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez une page..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pages?.map(page => (
                    <SelectItem key={page.id} value={page.slug}>
                      {page.name} (/p/{page.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Enregistrement..." : "Enregistrer les Paramètres"}
        </Button>
      </form>
    </Form>
  );
}