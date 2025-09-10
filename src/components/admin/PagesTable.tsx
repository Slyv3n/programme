'use client';

import type { Page } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Link from "next/link";
import { CreatePageDialog } from "./CreatePageDialog";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function PagesTable() {
    const { data: pages, mutate } = useSWR<Page[]>('/api/pages', fetcher);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={() => setIsDialogOpen(true)}>Créer une Page</Button>
            </div>

            <CreatePageDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setIsDialogOpen(false);
                    mutate();
                }}
            />

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom de la Page</TableHead>
                            <TableHead>Rôle Système</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pages?.map((page) => (
                            <TableRow key={page.id}>
                                <TableCell className="font-medium">{page.name}</TableCell>
                                <TableCell className="font-mono text-sm">/p/{page.id}</TableCell>
                                <TableCell className="space-x-2 text-right">
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`/p/${page.id}`} target="_blank">Voir</Link>
                                    </Button>
                                    <Button asChild size="sm" variant="outline">
                                        <Link href={`/admin/pages/${page.id}`}>Éditer</Link>
                                    </Button>
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