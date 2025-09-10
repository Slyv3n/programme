'use client';

import { IngredientSelection } from "@/types";
import { Ingredient, IngredientGroup } from "@prisma/client";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface IngredientCustomizationProps {
    groups: (IngredientGroup & { items: Ingredient[] })[];
    onSelectionChange: React.Dispatch<React.SetStateAction<IngredientSelection>>;
    selection: IngredientSelection;
}

export function IngredientCustomization({ groups, onSelectionChange, selection }: IngredientCustomizationProps) {
    const handleToggle = (ingredient: Ingredient) => {
        onSelectionChange(prevSelection => {
            const newSelection = { ...prevSelection };

            if (newSelection[ingredient.id] === 'removed') {
                delete newSelection[ingredient.id];
            }
            else if (ingredient.isRemovable) {
                newSelection[ingredient.id] = 'removed';
            }

            return newSelection;
        });
    };

    const handleAdd = (ingredient: Ingredient) => {
        onSelectionChange(prevSelection => {
            const newSelection = { ...prevSelection };
            newSelection[ingredient.id] = 'added';
            return newSelection;
        });
    };

    return (
        <div className="space-y-4">
            {groups.map(group => (
                <div key={group.id}>
                    <h3 className="font-bold mb-3 text-lg">{group.name}</h3>
                    <div className="space-y-3">
                        {group.items.map(ingredient => {
                            const status = selection[ingredient.id] || 'included';
                            const isIncluded = status === 'included';

                            return (
                                <div className="flex items-center justify-between min-h-[40px]" key={ingredient.id}>
                                    <div className="flex items-center space-x-3">
                                        <Switch
                                            checked={isIncluded || status === 'added'}
                                            disabled={!ingredient.isRemovable && status !== 'added'}
                                            id={ingredient.id.toString()}
                                            onCheckedChange={() => handleToggle(ingredient)}
                                        />
                                        <Label
                                            className={`${!ingredient.isRemovable ? 'text-gray-400' : ''}`}
                                            htmlFor={ingredient.id.toString()}
                                        >
                                            {ingredient.name}
                                        </Label>
                                    </div>
                                    {ingredient.addPrice ? (
                                        status === 'added' ? (
                                            <span className="font-semibold text-green-600 text-sm">Supplément ajouté</span>
                                        ) : (
                                            <Button
                                                onClick={() => handleAdd(ingredient)}
                                                size="sm"
                                                variant="outline"
                                            >
                                                Ajouter (+{ingredient.addPrice.toFixed(2)}€)
                                            </Button>
                                        )
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}