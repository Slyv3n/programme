'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";

interface SortableTableHeaderProps {
    columnName: string;
    label: string;
}

export function SortableTableHeader({ columnName, label }: SortableTableHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const sortBy = searchParams.get('sortBy');
    const order = searchParams.get('order');

    const handleClick = () => {
        const params = new URLSearchParams(searchParams);
        const newOrder = sortBy === columnName && order === 'asc' ? 'desc' : 'asc';
        params.set('sortBy', columnName);
        params.set('order', newOrder);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Button onClick={handleClick} variant="ghost">
            {label}
            <ArrowUpDown className="h-4 ml-2 w-4" />
        </Button>
    );
}