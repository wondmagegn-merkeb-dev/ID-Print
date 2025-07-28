
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SortableTableHead } from '@/components/ui/sortable-table-head';

type Package = {
  id: string;
  name: string;
  price: string;
  pdfMerges: number;
  idGenerations: number;
  popular: boolean;
  createdAt: string;
};

type SortKey = keyof Package | '';
type SortDirection = 'asc' | 'desc';

export default function AdminPackagesPage() {
  const [plans, setPlans] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planToDelete, setPlanToDelete] = useState<Package | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPackages() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/packages');
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }
        const data = await response.json();
        setPlans(data);
      } catch (err) {
        const e = err as Error;
        setError(e.message);
        toast({
            variant: "destructive",
            title: "Error fetching packages",
            description: e.message,
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchPackages();
  }, [toast]);
  
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortKey(key);
        setSortDirection('asc');
    }
  };
  
  const sortedPlans = [...plans].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const confirmDelete = async () => {
    if (planToDelete) {
      try {
        const response = await fetch(`/api/admin/packages/${planToDelete.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete package');
        }
        setPlans(plans.filter(p => p.id !== planToDelete.id));
        toast({
          title: "Package Deleted",
          description: `Package "${planToDelete.name}" has been deleted.`,
        });
      } catch (err) {
        const e = err as Error;
        toast({
          variant: "destructive",
          title: "Deletion Failed",
          description: e.message,
        });
      } finally {
        setPlanToDelete(null);
      }
    }
  };

  const renderSkeleton = () => (
    Array.from({ length: 4 }).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <AlertDialog>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                  <CardTitle>Manage Packages</CardTitle>
                  <CardDescription>A list of all subscription packages.</CardDescription>
              </div>
              <Button asChild>
                <Link href="/admin/packages/add">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Package
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHead label="Package Name" sortKey="name" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableTableHead label="Price" sortKey="price" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableTableHead label="PDF Merges" sortKey="pdfMerges" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableTableHead label="ID Generations" sortKey="idGenerations" currentSortKey={sortKey} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableTableHead label="Actions" isSortable={false} className="text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  renderSkeleton()
                ) : error ? (
                   <TableRow><TableCell colSpan={5} className="text-center h-24 text-destructive">{error}</TableCell></TableRow>
                ) : sortedPlans.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center h-24">No packages found.</TableCell></TableRow>
                ) : (
                  sortedPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">
                        {plan.name}
                        {plan.popular && <Badge variant="outline" className="ml-2">Popular</Badge>}
                      </TableCell>
                      <TableCell>{plan.price}</TableCell>
                      <TableCell>{plan.pdfMerges.toLocaleString()}</TableCell>
                      <TableCell>{plan.idGenerations.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/packages/edit/${plan.id}`}>Edit</Link>
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setPlanToDelete(plan);}} className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

       <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the package
            and it may affect users currently subscribed to it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setPlanToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
