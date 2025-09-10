'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { pageTemplates } from "@/lib/page-templates";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function CreatePageDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
    const router = useRouter();
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [pageName, setPageName] = useState('');
    const [pageSlug, setPageSlug] = useState('');

    const handleCreate = async () => {
        const response = await fetch('/api/pages/create-from-template', {
            body: JSON.stringify({ templateName: selectedTemplate, pageName, pageSlug }),
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
        });
        if(response.ok) {
            const newPage = await response.json();
            onClose();
            router.push(`/admin/pages/${newPage.id}`);
        }
    };

    return (
        <Dialog onOpenChange={onClose} open={isOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Créer une nouvelle page</DialogTitle>
                    <DialogDescription>Choisissez un modèle pour commencer.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="gap-4 grid grid-cols-2">
                        {pageTemplates.map(template => (
                            <div
                                className={`border cursor-pointer p-4 rounded-md ${selectedTemplate === template.name ? 'border-primary ring-2 ring-primary' : ''}`}
                                key={template.name}
                                onClick={() => setSelectedTemplate(template.name)}
                            >
                                <h3 className="font-semibold">{template.name}</h3>
                                <p className="text-muted-foreground text-sm">{template.description}</p>
                            </div>
                        ))}
                    </div>

                    {selectedTemplate && (
                        <div className="border-t pt-4 space-y-2">
                            <div>
                                <label>Nom de la page</label>
                                <Input
                                    onChange={e => setPageName(e.target.value)}
                                    value={pageName}
                                />
                            </div>
                            <div>
                                <label>URL (slug)</label>
                                <Input
                                    onChange={e => setPageSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                    value={pageSlug}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <Button disabled={!selectedTemplate || !pageName || !pageSlug} onClick={handleCreate}>Créer la page</Button>
            </DialogContent>
        </Dialog>
    );
}