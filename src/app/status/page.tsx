'use client';

import { Order } from "@prisma/client";
import { useEffect, useMemo, useRef } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const StatusColumn = ({ title, orders, bgColorClass }: { title: string; orders: Order[]; bgColorClass: string; }) => (
    <div className={`flex flex-col flex-1 p-4 rounded-lg ${bgColorClass}`}>
        <h2 className="border-b-2 font-bold mb-4 pb-2 text-3xl text-center text-white">{title}</h2>
        <div className="flex-grow overflow-y-auto space-y-3">
            {orders.map(order => (
                <div
                    className="bg-white font-bold p-5 rounded-md shadow-md text-center text-gray-800 text-4xl"
                    key={order.id}
                >
                    {order.orderNumber || order.id}
                </div>
            ))}
        </div>
    </div>
);

export default function StatusScreenPage() {
    const { data: orders } = useSWR<Order[]>('/api/orders/status-screen', fetcher, {
        refreshInterval: 3000,
    });

    const readyOrdersRef = useRef(new Set());
    const audioRef = useRef<HTMLAudioElement>(null);

    const awaitingPaymentOrders = useMemo(() =>
        orders?.filter(o => o.status === 'AWAITING_PAYMENT') || []
    , [orders]);

    const pendingOrders = useMemo(() =>
        orders?.filter(o => o.status === 'PENDING') || []
    , [orders]);

    const completedOrders = useMemo(() =>
        orders?.filter(o => o.status === 'COMPLETED') || []
    , [orders]);

    useEffect(() => {
        if (!orders) return;

        completedOrders.forEach(order => {
            if (!readyOrdersRef.current.has(order.id)) {
                audioRef.current?.play();
                readyOrdersRef.current.add(order.id);
            }
        });
    }, [completedOrders, orders]);

    return (
        <div className="bg-gray-800 flex gap-4 h-screen p-4 w-full">
            <StatusColumn bgColorClass="bg-yellow-600" orders={awaitingPaymentOrders} title="En attente de paiement" />
            <StatusColumn bgColorClass="bg-blue-600" orders={pendingOrders} title="En préparation" />
            <StatusColumn bgColorClass="bg-green-600" orders={completedOrders} title="Prête à être retirée" />
            <audio preload="auto" ref={audioRef} src="/sounds/notification.mp3" />
        </div>
    );
}