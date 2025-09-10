import { PromoCodesTable } from "@/components/admin/PromoCodesTable";

export default function AdminPromoCodesPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="font-bold mb-6 text-3xl">Gestion des Codes Promos</h1>
            <PromoCodesTable />
        </div>
    )
}