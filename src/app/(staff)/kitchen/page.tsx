'use client';

import { Order, OrderItem } from "@prisma/client";
import { Clock, RotateCw } from "lucide-react";
import { Suspense, useEffect, useRef, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

type OrderWithItems = Order & { items: OrderItem[] };

const calculateElapsedTime = (startTime: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(startTime).getTime();

    if (diff < 0) return { minutes: 0, seconds: 0 };

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return { minutes, seconds };
};

function useElapsedTime(startTime: Date) {
    const [elapsed, setElapsed] = useState(() => calculateElapsedTime(startTime));

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(calculateElapsedTime(startTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [startTime]);

    return elapsed;
}

function OrderCard({ order }: { order: Order & { items: OrderItem[] } }) {
    const elapsed = useElapsedTime(order.createdAt);

    let borderColor = 'border-transparent';
    if (elapsed.minutes >= 10) {
        borderColor = 'border-red-500';
    } else if (elapsed.minutes >= 5) {
        borderColor = 'border-yellow-400';
    }

    return (
        <div className={`bg-white border-4 flex flex-col h-full p-4 rounded-lg shadow-md transition-all ${borderColor}`}>
            <div className="border-b flex items-center justify-between mb-2 pb-2">
                <h3 className="font-bold text-xl">Commande #{order.id}</h3>
                <div className="flex font-bold gap-1 items-center text-gray-700 text-lg">
                    <Clock className="h-5 w-5" />
                    <span>{String(elapsed.minutes).padStart(2, '0')}:{String(elapsed.seconds).padStart(2, '0')}</span>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto py-2 space-y-2">
                {order.items.map(item => (
                    <div key={item.id}>
                        <p className="font-semibold">
                            <span className="inline-block mr-2 text-lg">{item.quantity}x</span>
                            {item.productName}
                        </p>
                        {item.customizations && (
                            <p className="pl-6 text-gray-600 text-sm">{item.customizations}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function KitchenPage() {
    const { data: orders, error, isValidating } = useSWR<OrderWithItems[]>('/api/orders', fetcher, {
        refreshInterval: 5000,
    });

    const audioRef = useRef<HTMLAudioElement>(null);
    const knownOrderIds = useRef(new Set());

    useEffect(() => {
        if (orders) {
            let isNewOrder = false;
            const currentOrderIds = new Set(orders.map(o => o.id));

            if (knownOrderIds.current.size === 0) {
                knownOrderIds.current = currentOrderIds;
                return;
            }

            orders.forEach(order => {
                if (!knownOrderIds.current.has(order.id)) {
                    isNewOrder = true;
                }
            });

            if (isNewOrder) {
                audioRef.current?.play();
            }

            knownOrderIds.current = currentOrderIds;
        }
    }, [orders]);

    if (error) return <div className="p-10 text-red-500">Erreur de chargement des commandes.</div>;
    if (!orders) return <div className="p-10">Chargement des commandes...</div>;

    return (
        <Suspense>
            <div className="bg-gray-100 min-h-screen p-4">
                <div className="flex items-center justify-center mb-4 relative">
                    <h1 className="font-bold text-3xl text-center">Commandes en Cours</h1>
                    <div className="absolute right-0 top-0">
                        <RotateCw className={`h-6 text-gray-400 transition-opacity w-6 ${isValidating ? 'animate-spin opacity-100' : 'opacity-0'}`} />
                    </div>
                </div>

                {orders.length === 0 ? (
                    <p className="mt-20 text-center text-gray-500">Aucune commande pour le moment.</p>
                ) : (
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {orders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
                <audio preload="auto" ref={audioRef} src="/sounds/notification.mp3" />
            </div>
        </Suspense>
    );
}