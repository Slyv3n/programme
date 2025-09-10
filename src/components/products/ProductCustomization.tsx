'use client';

import React from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { ProductWithRelations } from '@/lib/prisma-types';
import { SelectedOptions } from '@/types';
import { OptionGroup, ProductOption, ProductSubOption } from '@prisma/client';

interface ProductCustomizationProps {
  product: ProductWithRelations;
  selectedOptions: SelectedOptions;
  onSelectionChange: React.Dispatch<React.SetStateAction<SelectedOptions>>;
}

export function ProductCustomization({ product, selectedOptions, onSelectionChange }: ProductCustomizationProps) {

  const getGroupTotalQuantity = (groupId: number): number => {
    return (selectedOptions[groupId] || []).reduce((total, item) => total + item.quantity, 0);
  };

  const handleOptionToggle = (group: OptionGroup, option: ProductOption) => {
    onSelectionChange(prev => {
      const currentGroup = [...(prev[group.id] || [])];
      const itemIndex = currentGroup.findIndex(item => item.option.id === option.id);
      let newGroup;

      if (itemIndex > -1) {
        newGroup = currentGroup.filter(item => item.option.id !== option.id);
      } else {
        newGroup = [...currentGroup, { option, quantity: 1 }];
        if (newGroup.length > group.maxChoices) {
          newGroup.shift();
        }
      }
      
      return { ...prev, [group.id]: newGroup };
    });
  };

  const handleQuantityChange = (group: OptionGroup, option: ProductOption, change: 1 | -1) => {
    onSelectionChange(prev => {
      const currentGroup = prev[group.id] || [];
      const totalQuantityInGroup = currentGroup.reduce((sum, item) => sum + item.quantity, 0);

      if (change === 1 && totalQuantityInGroup >= group.maxChoices) {
        return prev;
      }

      const existingItem = currentGroup.find(item => item.option.id === option.id);
      let newGroup;

      if (existingItem) {
        const newQuantity = existingItem.quantity + change;
        if (newQuantity > 0) {
          newGroup = currentGroup.map(item =>
            item.option.id === option.id ? { ...item, quantity: newQuantity } : item
          );
        } else {
          newGroup = currentGroup.filter(item => item.option.id !== option.id);
        }
      } else if (change === 1) {
        newGroup = [...currentGroup, { option, quantity: 1 }];
      } else {
        return prev;
      }

      return { ...prev, [group.id]: newGroup };
    });
  };

  const handleSubOptionChange = (group: OptionGroup, option: ProductOption, subOption: ProductSubOption) => {
    onSelectionChange(prev => {
      const currentGroup = prev[group.id] || [];
      const newGroup = currentGroup.map(item => {
        if (item.option.id === option.id) {
          return { ...item, selectedSubOption: subOption };
        }
        return item;
      });
      return { ...prev, [group.id]: newGroup };
    });
  };

  return (
    <div className="space-y-6">
      {product.customizationOptionGroups?.map(group => {
        const totalQuantityInGroup = getGroupTotalQuantity(group.id);
        const minRequired = group.minChoices;
        const hasError = minRequired > 0 && totalQuantityInGroup < minRequired;

        return (
          <div key={group.id}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="flex font-bold items-center text-lg">
                {group.name}
                {minRequired > 0 && <span className="ml-2 text-red-500 text-sm">*</span>}
              </h3>
              {(group.allowQuantity || group.minChoices) && (
                <span className={`font-semibold text-sm ${hasError ? 'text-red-500' : 'text-green-600'}`}>
                  {totalQuantityInGroup} / {group.maxChoices} sélectionné(s)
                </span>
              )}
            </div>
            {hasError && <p className="mb-2 text-red-500 text-xs">Veuillez sélectionner le nombre requis d&apos;options.</p>}
            
            <div className="flex flex-wrap gap-3">
              {group.options.map(option => {
                const selectedItem = selectedOptions[group.id]?.find(i => i.option.id === option.id);
                const quantity = selectedItem?.quantity || 0;
                const showSubOptions = quantity > 0 && option.subOptions && option.subOptions.length > 0;
                const subOptionHasError = showSubOptions && !selectedItem?.selectedSubOption;

                return (
                    <div className="flex flex-col" key={option.id}>
                      {group.allowQuantity ? (
                        <div className="border flex gap-2 items-center p-1 rounded-full shadow-sm w-fit">
                          <button
                            className="bg-gray-200 font-bold h-8 hover:bg-gray-300 rounded-full text-lg transition w-8"
                            onClick={() => handleQuantityChange(group, option, -1)}
                          >
                            -
                          </button>
                          <span className="font-medium min-w-[80px] text-center">
                            {option.name} {quantity > 0 ? <span className="font-bold">(x{quantity})</span> : ''}
                          </span>
                          <button
                            className="bg-gray-200 font-bold h-8 hover:bg-gray-300 rounded-full text-lg transition w-8"
                            onClick={() => handleQuantityChange(group, option, 1)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <Button
                          className="h-auto px-4 py-2 rounded-full w-fit"
                          onClick={() => handleOptionToggle(group, option)}
                          variant={selectedItem ? 'default' : 'outline'}
                        >
                          {option.name} {option.priceModifier ? ` (+${option.priceModifier.toFixed(2)}€)` : ''}
                        </Button>
                      )}

                      {showSubOptions && (
                        <div className="pl-8 pt-3">
                          <p className="font-semibold mb-2 text-gray-700 text-sm">Choisissez une cuisson :</p>
                          {subOptionHasError && <p className="mb-2 text-red-500 text-xs">Une sélection est requise.</p>}
                          <RadioGroup
                            className="flex flex-wrap gap-x-4 gap-y-2"
                            onValueChange={(value) => {
                              const subOption = option.subOptions?.find(so => so.id.toString() === value);
                              if (subOption) {
                                handleSubOptionChange(group, option, subOption);
                              }
                            }}
                            value={selectedItem?.selectedSubOption?.id?.toString()}
                          >
                            {option.subOptions?.map(subOption => (
                              <div className="flex items-center space-x-2" key={subOption.id}>
                                <RadioGroupItem id={`${option.id}-${subOption.id}`} value={subOption.id.toString()} />
                                <Label htmlFor={`${option.id}-${subOption.id}`}>{subOption.name}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}