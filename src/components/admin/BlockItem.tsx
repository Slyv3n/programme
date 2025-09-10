'use client';

import { Block } from '@prisma/client';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { GripVertical, PlusCircle } from 'lucide-react';

// Interface pour définir les props attendues par BlockItem
interface BlockItemProps {
  block: Block;
  allBlocks: Block[];
  onEdit: (b: Block) => void;
  onDelete: (id: number) => void;
  onAddBlock: (parentId: number | null, columnKey: string | null) => void;
  isDragging?: boolean;
}

// Composant interne pour une colonne "déposable"
const ColumnDropZone = ({ id, children, onAddBlock }: { id: string, children: React.ReactNode, onAddBlock: () => void }) => {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className="w-full p-2 bg-gray-100 rounded-lg min-h-[10rem] border-2 border-dashed border-gray-300 space-y-2 flex flex-col">
      <div className="flex-grow space-y-2">
        {children}
      </div>
      <Button size="sm" variant="ghost" className="w-full mt-auto text-muted-foreground hover:bg-gray-200" onClick={onAddBlock}>
        <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un bloc ici
      </Button>
    </div>
  );
};

// Le composant principal, qui s'appelle lui-même (récursif)
export function BlockItem({ 
  block, 
  allBlocks, 
  onEdit, 
  onDelete, 
  onAddBlock, 
  isDragging 
}: BlockItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  // Logique pour les blocs conteneurs (mise en page)
  if (block.type === 'columnLayout') {
    const children = allBlocks.filter((b: Block) => b.parentId === block.id);
    const columnsData = (block.content as any)?.columns || [['0'], ['1']]; // Supporte plusieurs configurations de colonnes

    return (
      <div ref={setNodeRef} style={style} className={cn("space-y-2 rounded-lg", isDragging ? "opacity-50" : "bg-blue-50")}>
        {/* En-tête du bloc, stylisé comme un bloc simple */}
        <div className="border p-4 rounded-md flex justify-between items-center bg-white">
            <div className="flex items-center gap-2">
                <button {...attributes} {...listeners} className="cursor-grab p-1">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </button>
                <p className="text-sm">
                    Mise en page : <strong className="font-semibold">{columnsData.length} Colonnes</strong>
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(block)}>Éditer</Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Supprimer</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer ce bloc et son contenu ?</AlertDialogTitle>
                            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(block.id)}>Confirmer</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
        
        {/* Contenu du bloc (les colonnes) */}
        <div className="flex gap-2 pl-6"> {/* On indente légèrement les colonnes */}
          {columnsData.map((_: any, index: number) => {
            const columnKey = `${index}`;
            const columnChildren = children.filter((b: Block) => b.columnKey === columnKey).sort((a,b) => a.order - b.order);
            return (
              <ColumnDropZone key={index} id={`${block.id}-${columnKey}`} onAddBlock={() => onAddBlock(block.id, columnKey)}>
                <SortableContext items={columnChildren.map(b => b.id)} strategy={verticalListSortingStrategy}>
                  {columnChildren.map(b => <BlockItem key={b.id} block={b} allBlocks={allBlocks} onEdit={onEdit} onDelete={onDelete} onAddBlock={onAddBlock} />)}
                </SortableContext>
              </ColumnDropZone>
            )
          })}
        </div>
      </div>
    );
  }

  // Logique pour les blocs simples
  return (
    <div ref={setNodeRef} style={style} className={cn("border p-4 rounded-md flex justify-between items-center bg-white gap-4", isDragging && "opacity-50 shadow-lg")}>
      <div className="flex items-center gap-2 min-w-0">
        <button {...attributes} {...listeners} className="cursor-grab p-1 flex-shrink-0">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </button>
        <p className="truncate text-sm">
          Bloc : <strong className="font-semibold">{block.type}</strong>
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button variant="outline" size="sm" onClick={() => onEdit(block)}>Éditer</Button>
        <AlertDialog>
          <AlertDialogTrigger asChild><Button variant="destructive" size="sm">Supprimer</Button></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Supprimer ce bloc ?</AlertDialogTitle><AlertDialogDescription>Action irréversible.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(block.id)}>Confirmer</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}