import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { Euro, Package, Users } from "lucide-react";

async function getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysOrders = await prisma.order.findMany({
        where: { createdAt: { gte: today } },
    });

    const todaysRevenue = todaysOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = todaysOrders.length;
    const totalClients = await prisma.user.count();

    return { todaysRevenue, totalOrders, totalClients };
}

export default async function AdminDashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="container mx-auto py-10">
            <h1 className="font-bold mb-6 text-3xl">Tableau de Bord</h1>
            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="font-medium text-sm">Chiffre d&apos;Affaires (Aujourd&apos;hui)</CardTitle>
                        <Euro className="h-4 text-muted-foreground w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">{stats.todaysRevenue.toFixed(2)} €</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="font-medium text-sm">Commandes (Aujourd&apos;hui)</CardTitle>
                        <Package className="h-4 text-muted-foreground w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">+{stats.totalOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="font-medium text-sm">Clients Fidélité (Total)</CardTitle>
                        <Users className="h-4 text-muted-foreground w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="font-bold text-2xl">{stats.totalClients}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}