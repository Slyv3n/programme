import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Block } from "@prisma/client";

/**
 * Trouve l'ID du conteneur (ex: 'root', '12-0') auquel un bloc appartient.
 */
export const findContainerId = (id: string | number, containers: { [key: string]: number[] }) => {
  if (id in containers) return id as string;
  return Object.keys(containers).find((key) => containers[key].includes(id as number));
};

/**
 * Initialise la structure des conteneurs à partir de la liste de blocs de la BDD.
 */
export const initializeContainers = (blocks: Block[]): { [key: string]: number[] } => {
  const containers: { [key: string]: number[] } = { root: [] };
  const allChildIds = new Set<number>();

  // D'abord, on identifie tous les conteneurs possibles
  blocks.forEach(block => {
    if (block.type === 'columnLayout') {
      const content = block.content as any;
      (content?.columns || [[]]).forEach((_: any, index: number) => {
        containers[`${block.id}-${index}`] = [];
      });
    }
  });

  // Ensuite, on place chaque bloc dans son conteneur
  blocks.forEach(block => {
    if (block.parentId && block.columnKey !== null) {
      const containerId = `${block.parentId}-${block.columnKey}`;
      if (containers[containerId]) {
        containers[containerId].push(block.id);
        allChildIds.add(block.id);
      }
    }
  });

  // Les blocs "racine" sont ceux qui ne sont enfants d'aucun autre bloc
  containers.root = blocks
    .filter(b => !allChildIds.has(b.id))
    .sort((a, b) => a.order - b.order)
    .map(b => b.id);
    
  // Enfin, on trie les blocs à l'intérieur de chaque conteneur
  for (const id in containers) {
    if (id !== 'root') {
        containers[id] = containers[id].sort((a, b) => {
            const blockA = blocks.find(block => block.id === a);
            const blockB = blocks.find(block => block.id === b);
            return (blockA?.order || 0) - (blockB?.order || 0);
        });
    }
  }
  
  return containers;
};

/**
 * Gère la logique de fin de glisser-déposer.
 */
export const handleDragEndLogic = (
  event: DragEndEvent,
  containers: { [key: string]: number[] }
) => {
  const { active, over } = event;
  if (!over) return { newContainers: containers, needsUpdate: false };

  const activeContainerId = findContainerId(active.id, containers);
  const overId = over.id;
  const overContainerId = findContainerId(overId, containers) || (overId in containers ? String(overId) : undefined);

  if (!activeContainerId || !overContainerId || active.id === overId) {
    return { newContainers: containers, needsUpdate: false };
  }

  const newContainers = JSON.parse(JSON.stringify(containers)); // Copie profonde
  const activeItems = newContainers[activeContainerId];
  const overItems = newContainers[overContainerId];
  const activeIndex = activeItems.indexOf(active.id as number);
  
  let overIndex;
  if (overId in newContainers) {
    overIndex = overItems.length;
  } else {
    overIndex = overItems.indexOf(overId as number);
  }

  if (activeContainerId === overContainerId) {
    if (activeIndex !== overIndex) {
      newContainers[activeContainerId] = arrayMove(activeItems, activeIndex, overIndex);
    }
  } else {
    const [movedItem] = activeItems.splice(activeIndex, 1);
    overItems.splice(overIndex >= 0 ? overIndex : overItems.length, 0, movedItem);
  }
  
  return { newContainers, needsUpdate: true };
};