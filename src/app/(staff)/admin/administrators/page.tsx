import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import prisma from "@/lib/prisma";

async function getAdminUsers() {
    return await prisma.adminUser.findMany({
        orderBy: { username: 'asc' },
    });
}

export default async function AdminUsersPage() {
    const users = await getAdminUsers();

    return (
        <div className="container mx-auto py-10">
            <h1 className="font-bold mb-6 text-3xl">Gestion des Administrateurs</h1>
            <AdminUsersTable users={users} />
        </div>
    );
};