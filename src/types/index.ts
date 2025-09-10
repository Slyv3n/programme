import { ProductOption, ProductSubOption, PromoCode } from "@prisma/client";

export type IngredientSelection = Record<string, 'included' | 'removed' | 'added'>;

export type ProductOptionWithSubOptions = ProductOption & {
    subOptions: ProductSubOption[];
};

export interface SelectedOptionWithQuantity {
    option: ProductOptionWithSubOptions;
    quantity: number;
    selectedSubOption?: ProductSubOption;
}

export type SelectedOptions = Record<string, SelectedOptionWithQuantity[]>;

export type { PromoCode };