import { OrdersTable } from "@/components/admin/OrdersTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminOrdersPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-bold text-3xl">Historique des Commandes</h1>
                    <p className="text-muted-foreground">La liste est mise à jour automatiquement.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/products">Gérer les produits</Link>
                </Button>
            </div>

            <OrdersTable />
        </div>
    );
}