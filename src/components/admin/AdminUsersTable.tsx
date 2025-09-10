'use client';

import { AdminUser } from "@prisma/client";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export function AdminUsersTable({ users }: { users: AdminUser[] }) {
    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button>Ajouter un administrateur</Button>
            </div>
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom d&apos;utilisateur</TableHead>
                            <TableHead>Date de création</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="destructive">Supprimer</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}