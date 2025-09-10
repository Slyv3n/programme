import prisma from '@/lib/prisma';
import { Prisma } from "@prisma/client";

export const createCategory = async (name: string) => {
    try {
        return await prisma.category.create({ data: { name } });
    } catch (error) {
        console.error("Erreur de connexion BDD (createCategory):", error);
        throw new Error("Impossible de créer la catégorie.");
    }
};

export const createProduct = async (data: Prisma.ProductCreateInput) => {
    if (typeof data.name !== 'string') {
        throw new Error("Le nom du produit est invalide.");
    }

    const normalizedName = data.name.toLowerCase();

    const existingProduct = await prisma.product.findFirst({
        where: {
            name: normalizedName,
            categoryId: typeof data.category?.connect?.id === 'number' ? data.category.connect.id : undefined,
        },
    });

    if (existingProduct) {
        throw new Error("Un produit avec ce nom existe déjà dans cette catégorie.");
    }

    try {
        const dataWithNormalizedName = {
            ...data,
            name: normalizedName,
        };
        return await prisma.product.create({ data: dataWithNormalizedName });
    } catch (error) {
        console.error("Erreur de BDD (createProduct):", error);
        throw new Error("Impossible de créer le produit.");
    }
};

export const deleteProduct = async (id: number) => {
    try {
        return await prisma.product.delete({ where: { id } });
    } catch (error) {
        console.error(`Erreur de connexion BDD (deleteProduct: ${id}):`, error);
        throw new Error(`Impossible de supprimer le produit ${id}.`);
    }
};

export const getCategories = async () => {
    try {
        return await prisma.category.findMany({
            orderBy: [
                { position: 'asc' },
                { name: 'asc' }
            ],
        });
    } catch (error) {
        console.error("Erreur de connexion BDD (getCategories):", error);
        throw new Error("Impossible de récupérer les catégories.");
    }
}

export const getOrders = async () => {
    try {
        return await prisma.order.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error("Erreur de connexion BDD (getOrders):", error);
        throw new Error("Impossible de récupérer les commandes.");
    }
}

export const getProductsForKiosk = async () => {
    try {
        return await prisma.product.findMany({
            include: {
                category: true,
                customizationOptionGroups: {
                    include: { options: { include: { subOptions: true } } },
                    orderBy: { position: 'asc' },
                },
                ingredientGroups: { include: { items: true } },
            },
        });
    } catch {
        throw new Error("Impossible de récupérer les produits.");
    }
};

export const getProductsForAdmin = async ({ sortBy, order, query }: { sortBy: string, order: 'asc' | 'desc', query?: string }) => {
    try {
        const whereClause = query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { category: { name: { contains: query, mode: 'insensitive' } } }
            ]
        } : {};
        let orderBy = { [sortBy]: order };
        if (sortBy === 'category') { orderBy = { category: { name: order } }; }

        return await prisma.product.findMany({
            include: { category: true },
            orderBy,
            where: whereClause,
        });
    } catch {
        throw new Error("Impossible de récupérer les produits.");
    }
};

export const getProductById = async (id: number) => {
    try {
        if (isNaN(id)) return undefined;
        return await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                customizationOptionGroups: {
                    include: { options: { include: { subOptions: true } } },
                    orderBy: { position: 'asc' },
                },
                ingredientGroups: { include: { items: true } },
            },
        });
    } catch (error) {
        console.error("Erreur de connexion BDD (getProductById):", error);
        throw new Error(`Impossible de récupérer le produit ${id}.`);
    }
};

export const getPromoCode = async (codeToFind: string) => {
    try {
        return await prisma.promoCode.findUnique({
            where: { code: codeToFind.toUpperCase() },
        });
    } catch (error) {
        console.error("Erreur de connexion BDD (getPromoCode):", error);
        throw new Error("Impossible de vérifier le code promo.");
    }
};

export const updateProduct = async (id: number, data: Prisma.ProductUpdateInput) => {
    try {
        if (typeof data.name === 'string') {
            const normalizedName = data.name.toLowerCase();

            const existingProduct = await prisma.product.findFirst({
                where: {
                    name: normalizedName,
                    categoryId: data.categoryId,
                    NOT: {
                        id: id,
                    },
                },
            });

            if (existingProduct) {
                throw new Error("Un autre produit avec ce nom existe déjà dans cette catégorie.");
            }

            data.name = normalizedName;
        }
        return await prisma.product.update({ where: { id }, data });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new Error("Un autre produit avec ce nom existe déjà dans cette catégorie.");
        }
        console.error(`Erreur de BDD (updateProduct: ${id}):`, error);
        throw new Error(`Impossible de mettre à jour le produit ${id}.`);
    }
};