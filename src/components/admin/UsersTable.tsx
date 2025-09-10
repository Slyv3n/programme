'use client';

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function UsersTable({ users }: { users: User[] }) {
    const router = useRouter();

    const handleToggleBlacklist = async (user: User) => {
        await fetch(`/api/users/${user.id}/blacklist`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isBlacklisted: !user.isBlacklisted }),
        });
        router.refresh();
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Numéro de téléphone</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.phone}</TableCell>
                        <TableCell>{user.points}</TableCell>
                        <TableCell>
                            {user.isBlacklisted ? (
                                <Badge variant="destructive">Blacklisté</Badge>
                            ) : (
                                <Badge variant="secondary">Actif</Badge>
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button
                                onClick={() => handleToggleBlacklist(user)}
                                size="sm"
                                variant={user.isBlacklisted ? "outline" : "destructive"}
                            >
                                {user.isBlacklisted ? "Réactiver" : "Blacklister"}
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}