import { PagesTable } from "@/components/admin/PagesTable";

export default function AdminPagesPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="font-bold mb-6 text-3xl">Gestion des Pages</h1>
            <p className="mb-4 text-muted-foreground">
                Créez et gérez les pages personnalisées de votre application.
            </p>
            <PagesTable />
        </div>
    );
}