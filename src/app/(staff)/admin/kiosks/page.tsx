import { KiosksTable } from "@/components/admin/KiosksTable";

export default function AdminKiosksPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="font-bold mb-6 text-3xl">Gestion des Bornes</h1>
            <p className="mb-4 text-muted-foreground">Supervisez l&apos;état de toutes vos bornes enregistrées et gérez leurs paramètres. Le statut est mis à jour en temps réel.</p>
            <KiosksTable />
        </div>
    );
}