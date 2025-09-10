'use client';

import { useState, useEffect, useMemo } from 'react';
import { Block, Page } from "@prisma/client";
import useSWR from 'swr';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { DndContext, DragEndEvent, DragOverlay, useSensor, PointerSensor, useSensors } from '@dnd-kit/core';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { PageSettingsForm } from '@/components/admin/PageSettingsForm';
import { BlockLibrary } from '@/components/block-library';

import { HeroBlockForm } from '@/components/admin/block-forms/HeroBlockForm';
import { CtaButtonBlockForm } from '@/components/admin/block-forms/CtaButtonBlockForm';
import { LanguageSwitcherBlockForm } from '@/components/admin/block-forms/LanguageSwitcherBlockForm';
import { TextBlockForm } from '@/components/admin/block-forms/TextBlockForm';
import { ColumnLayoutBlockForm } from '@/components/admin/block-forms/ColumnLayoutBlockForm';
import { SortableContext } from '@dnd-kit/sortable';
import { BlockItem } from '@/components/admin/BlockItem';
import { handleDragEndLogic, initializeContainers } from '@/lib/dnd-utils';

const fetcher = (url: string) => fetch(url).then(res => res.json());

type PageWithBlocks = Page & { blocks: Block[] };

const blockForms: { [key: string]: React.FC<any> } = {
  columnLayout: ColumnLayoutBlockForm,
  ctaButton: CtaButtonBlockForm,
  hero: HeroBlockForm,
  languageSwitcher: LanguageSwitcherBlockForm,
  text: TextBlockForm,
};

const getPathForSystemPage = (systemType: string | null) => {
    switch (systemType) {
        case 'WELCOME': return '/';
        case 'ORDER_TYPE': return '/order-type';
        case 'MENU': return '/menu';
        default: return null;
    }
};

export default function AdminEditPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: pageData, error, mutate } = useSWR<PageWithBlocks>(`/api/pages/${id}`, fetcher);
  
  const [containers, setContainers] = useState<{ [key: string]: number[] }>({ root: [] });
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const [iframeKey, setIframeKey] = useState(Date.now());

  const allBlocks = useMemo(() => pageData?.blocks || [], [pageData]);
  const rootBlocks = useMemo(() => allBlocks.filter(b => b.parentId === null).sort((a,b) => a.order - b.order), [allBlocks]);

  useEffect(() => {
    if (pageData) {
      setContainers(initializeContainers(pageData.blocks));
    }
  }, [pageData]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveBlock(null);
    const { newContainers, needsUpdate } = handleDragEndLogic(event, containers);
    
    if (needsUpdate) {
      setContainers(newContainers);

      try {
        await fetch(`/api/pages/${id}/structure`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ containers: newContainers }),
        });
        toast.success("Mise en page sauvegardée.");
      } catch {
        toast.error("Erreur de sauvegarde de la structure.");
      } finally {
        mutate();
        setIframeKey(Date.now());
      }
    }
  };
  
  const handleAddBlock = async (type: string, parentId: number | null = null, columnKey: string | null = null) => {
    const order = parentId === null 
      ? (containers.root || []).length 
      : (containers[`${parentId}-${columnKey}`] || []).length;
    
    try {
      await fetch("/api/blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, pageId: parseInt(id), parentId, columnKey, order, content: {} }),
      });
      toast.success(`Bloc ${type} ajouté.`);
    } catch {
      toast.error("Erreur lors de la création.");
    } finally {
      mutate();
      setIframeKey(Date.now());
    }
  };
  
  const handleDeleteBlock = async (blockId: number) => {
    try {
      await fetch(`/api/blocks/${blockId}`, { method: 'DELETE' });
      toast.success("Bloc supprimé.");
    } catch {
      toast.error("Erreur lors de la suppression.");
    } finally {
      mutate();
      setIframeKey(Date.now());
    }
  };

  const handleSaveBlock = async (blockId: number, newContent: any) => {
    try {
        await fetch(`/api/blocks/${blockId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: newContent }),
        });
        toast.success("Bloc mis à jour.");
    } catch {
        toast.error("Erreur de mise à jour.");
    } finally {
        setSelectedBlock(null);
        mutate();
        setIframeKey(Date.now());
    }
  };

  if (error) return <div className="p-10 text-center text-red-500">Erreur de chargement.</div>;
  if (!pageData) return <div className="p-10 text-center">Chargement...</div>;

  const FormComponent = selectedBlock ? blockForms[selectedBlock.type as keyof typeof blockForms] : null;
  const iframeSrc = `/p/${pageData.id}?edit_mode=true&kioskId=ADMIN_PREVIEW`;
  
  return (
    <DndContext sensors={sensors} onDragStart={e => setActiveBlock(allBlocks.find(b => b.id === e.active.id) || null)} onDragEnd={handleDragEnd}>
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 flex h-screen">
        <aside className="backdrop-blur-sm bg-white/95 border-r border-slate-200 flex flex-col overflow-y-auto p-6 shadow-lg w-96">
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold pr-2 text-slate-800 text-xl truncate">Éditeur</h2>
                <p className="text-slate-600 text-sm">{pageData.name}</p>
              </div>
              <Button asChild className="bg-transparent shrink-0" size="sm" variant="outline"><Link href="/admin/pages">← Retour</Link></Button>
            </div>
            <div className="bg-slate-50/50 border border-slate-200 mb-6 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-slate-700">Paramètres de la Page</h3>
              <PageSettingsForm page={pageData} onSave={mutate} />
            </div>
            <div className="bg-slate-50/50 border border-slate-200 mb-6 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-slate-700">Blocs de la Page</h3>
              <div className="space-y-2">
                <SortableContext items={rootBlocks.map(b => b.id)}>
                  {rootBlocks.map(block => (
                    <BlockItem
                      key={block.id}
                      block={block}
                      allBlocks={allBlocks}
                      onEdit={setSelectedBlock}
                      onDelete={handleDeleteBlock}
                      onAddBlock={handleAddBlock}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>
            <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-lg">
              <BlockLibrary onAddBlock={(type) => handleAddBlock(type, null, null)} />
            </div>
          </div>
        </aside>
        <main className="flex-grow relative">
          <iframe id="preview-iframe" key={iframeKey} src={iframeSrc} className="bg-white border-none h-full rounded-tl-lg shadow-inner w-full" />
        </main>
        <Dialog open={!!selectedBlock} onOpenChange={setSelectedBlock}>
          <DialogContent className="bg-white max-w-2xl">
            <DialogHeader><DialogTitle>Modifier : <span className="text-blue-600">{selectedBlock?.type}</span></DialogTitle></DialogHeader>
            {FormComponent && selectedBlock && (
              <FormComponent
                block={selectedBlock}
                onSave={(newContent: any) => handleSaveBlock(selectedBlock.id, newContent)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
      <DragOverlay>
        {activeBlock && (
          <Card className="opacity-90 w-64"><CardContent className="p-4"><div className="font-medium text-sm">{activeBlock.type}</div></CardContent></Card>
        )}
      </DragOverlay>
    </DndContext>
  );
}
