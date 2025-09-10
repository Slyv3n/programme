'use client';

import { Order, OrderItem } from "@prisma/client";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import useSWR from "swr";
import { ChevronDown, Pause, Play, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

type OrderWithItems = Order & { items: OrderItem[] };

const fetcher = (url: string) => fetch(url).then(res => res.json());
const REFRESH_INTERVAL = 10;

const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
        PENDING: { className: 'border-blue-600 text-blue-600', label: 'En préparation' },
        COMPLETED: { className: 'bg-green-600 text-white', label: 'Terminée' },
        AWAITING_PAYMENT: { className: '', label: 'Attente Paiement' },
        CANCELLED: { className: 'bg-red-600 text-white', label: 'Annulée' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: 'Inconnu', className: '' };

    return (
        <Badge
            className={config.className}
            variant={status === 'PENDING' ? 'outline' : (status === 'AWAITING_PAYMENT' ? 'secondary' : 'default')}
        >
            {config.label}
        </Badge>
    );
};

export function OrdersTable() {
    const [isPaused, setIsPaused] = useState(false);
    const { data: orders, error, isLoading, isValidating, mutate } = useSWR<OrderWithItems[]>('/api/orders/admin', fetcher, {
        refreshInterval: isPaused ? 0 : REFRESH_INTERVAL * 1000,
        revalidateOnFocus: false,
    });

    const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

    useEffect(() => {
        if (isPaused) return;

        if (!isValidating) setCountdown(REFRESH_INTERVAL);

        const interval = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [isValidating, isPaused]);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        mutate(orders?.map(order => order.id === orderId ? { ...order, status: newStatus } : order), false);

        await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });

        mutate();
    };

    if (error) return <div className="p-8 text-center text-red-500">Erreur de chargement des commandes.</div>;
    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>;

    return (
        <div>
            <div className="flex gap-2 items-center justify-end mb-4">
                <Button
                    onClick={() => setIsPaused(!isPaused)}
                    size="sm"
                    variant="outline"
                >
                    {isPaused ? <Play className="h-4 mr-2 w-4" /> : <Pause className="h-4 mr-2 w-4" />}
                    {isPaused ? 'Reprendre' : 'Mettre en pause'}
                </Button>
                <Button
                    disabled={isValidating || isPaused}
                    onClick={() => mutate()}
                    size="sm"
                    variant="outline"
                >
                    <RotateCw className={`h-4 mr-2 w-4 ${isValidating ? 'animate-spin' : ''}`} />
                    {isValidating ? 'Actualisation...' : (isPaused ? 'En pause' : `Actualisation dans ${countdown}s`)}
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>N° Commande</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Nb. Articles</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders && orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">#{order.orderNumber || order.id}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleString('fr-FR')}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                className="flex gap-2 items-center"
                                                variant="ghost"
                                            >
                                                <StatusBadge status={order.status} />
                                                <ChevronDown className="h-4 text-muted-foreground w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'AWAITING_PAYMENT')}>Attente Paiement</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'PENDING')}>En préparation</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'COMPLETED')}>Terminée</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500" onClick={() => handleStatusChange(order.id, 'CANCELLED')}>Annulée</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                                <TableCell>{order.items.length}</TableCell>
                                <TableCell className="font-bold text-right">{order.total.toFixed(2)} €</TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline">
                                        Voir
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {(orders?.length === 0) && (
                    <div className="p-8 text-center text-muted-foreground">
                        Aucune commande pour aujourd&apos;hui.
                    </div>
                )}
            </div>
        </div>
    );
}