import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(3, { message: "Le nom doit faire au moins 3 caractères." }),
    price: z.coerce.number().positive({ message: "Le prix doit être un nombre positif." }),
    categoryId: z.coerce.number({ message: "Veuillez sélectionner une catégorie." }).int().positive("Veuillez sélectionner une catégorie."),
    description: z.string().optional(),
    imageUrl: z.string().url({ message: "Doit être une URL valide." }).or(z.literal('')).optional(),
    isAvailable: z.boolean().default(true),
    pointCost: z.coerce.number().int().min(0).optional().nullable(),
    calories: z.coerce.number().int().min(0).optional().nullable(),
    allergens: z.string().optional(),
});

export const optionGroupSchema = z.object({
    name: z.string().min(3, { message: "Le nom doit faire au moins 3 caractères." }),
    position: z.coerce.number().int().optional().nullable(),
    minChoices: z.coerce.number().int().min(0),
    maxChoices: z.coerce.number().int().min(1),
    allowQuantity: z.boolean().default(false),
});

export const optionSchema = z.object({
    name: z.string().min(2, { message: "Le nom doit faire au moins 2 caractères." }),
    priceModifier: z.coerce.number().optional(),
});

export const ingredientSchema = z.object({
    name: z.string().min(2, { message: "Le nom doit faire au moins 2 caractères." }),
    isRemovable: z.boolean().default(true),
    addPrice: z.coerce.number().optional().nullable(),
});