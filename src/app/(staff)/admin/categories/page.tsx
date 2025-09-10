import { CategoriesTable } from "@/components/admin/CategoriesTable";

export default function AdminCategoriesPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="font-bold mb-6 text-3xl">Gestion des Catégories</h1>
            <CategoriesTable />
        </div>
    );
}