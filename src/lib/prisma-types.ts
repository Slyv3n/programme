import { Prisma } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const productWithRelations = Prisma.validator<Prisma.ProductDefaultArgs>()({
    include: {
        category: true,
        customizationOptionGroups: {
            include: {
                options: {
                    include: {
                        subOptions: true,
                    },
                },
            },
            orderBy: { position: 'asc' },
        },
        ingredientGroups: {
            include: {
                items: true,
            },
        },
    },
});

export type ProductWithRelations = Prisma.ProductGetPayload<typeof productWithRelations>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const optionGroupWithRelations = Prisma.validator<Prisma.OptionGroupDefaultArgs>()({
    include: {
        options: {
            include: {
                subOptions: true
            }
        }
    }
});

export type OptionGroupWithRelations = Prisma.OptionGroupGetPayload<typeof optionGroupWithRelations>;