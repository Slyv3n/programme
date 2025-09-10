'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { IngredientGroupsManager } from "./forms/IngredientGroupsManager";
import { OptionGroupsManager } from "./forms/OptionGroupsManager";
import { ProductWithRelations } from "@/lib/prisma-types";
import { ProductForm } from "./ProductForm";

interface ProductEditFormProps {
    product: ProductWithRelations;
}

export function ProductEditForm({ product }: ProductEditFormProps) {
    return (
        <div className="gap-6 grid">
            <Card>
                <CardHeader>
                    <CardTitle>Informations Générales</CardTitle>
                    <CardDescription>Modifiez le nom, le prix, la catégorie, etc.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm product={product} />
                </CardContent>
            </Card>
            
            <OptionGroupsManager product={product} />
            <IngredientGroupsManager product={product} />
        </div>
    );
}