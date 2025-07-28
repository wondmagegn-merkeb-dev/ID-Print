
"use client"

import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "./button";
import { TableHead } from "./table";
import { cn } from "@/lib/utils";

type SortableTableHeadProps<T> = {
    label: string;
    sortKey?: T;
    currentSortKey?: T;
    sortDirection?: 'asc' | 'desc';
    onSort?: (key: T) => void;
    isSortable?: boolean;
    className?: string;
}

export function SortableTableHead<T extends string>({ 
    label, 
    sortKey, 
    currentSortKey, 
    sortDirection, 
    onSort, 
    isSortable = true,
    className
}: SortableTableHeadProps<T>) {

    const handleSort = () => {
        if (isSortable && onSort && sortKey) {
            onSort(sortKey);
        }
    }

    const isSorted = currentSortKey === sortKey;
    const SortIcon = sortDirection === 'asc' ? ArrowUp : ArrowDown;

    return (
        <TableHead className={cn("p-2", className)}>
            {isSortable ? (
                <Button variant="ghost" onClick={handleSort} className="px-2 py-1 h-auto">
                    {label}
                    {isSorted && <SortIcon className="ml-2 h-4 w-4" />}
                </Button>
            ) : (
                <span>{label}</span>
            )}
        </TableHead>
    );
}

