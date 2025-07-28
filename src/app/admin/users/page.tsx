

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, ChevronLeft, ChevronRight, Pencil, Trash2, Search, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { SortableTableHead } from '@/components/ui/sortable-table-head';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
  avatar?: string | null;
  createdAt: string;
  invitedBySource: 'SELF' | 'ADMIN' | 'USER';
};

type SortKey = keyof User | '';
type SortDirection = 'asc' | 'desc';


const USERS_PER_PAGE = 6;

export default function AdminUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
        setError(null);
      } catch (err) {
        const e = err as Error;
        setError(e.message);
        toast({
            variant: "destructive",
            title: "Error fetching users",
            description: e.message
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [toast]);
  
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (roleFilter === 'all' || user.role === roleFilter) &&
      (statusFilter === 'all' || user.status === statusFilter)
    );
  }, [users, searchQuery, roleFilter, statusFilter]);

  const sortedUsers = useMemo(() => {
    if (!sortKey) return filteredUsers;

    const sorted = [...filteredUsers].sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
    });

    if (sortDirection === 'desc') {
        sorted.reverse();
    }
    
    return sorted;
  }, [filteredUsers, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );
  
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [searchQuery, roleFilter, statusFilter, currentPage, totalPages]);


  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
        setSortKey(key);
        setSortDirection('asc');
    }
    setCurrentPage(1);
  };
  
  const handleClearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const response = await fetch(`/api/users/${userToDelete.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || 'Failed to delete user.');
        }

        const updatedUsers = users.filter(u => u.id !== userToDelete.id);
        setUsers(updatedUsers);
        
        const newTotalPages = Math.ceil(updatedUsers.length / USERS_PER_PAGE);
        if (currentPage > newTotalPages) {
            setCurrentPage(Math.max(1, newTotalPages));
        }

        toast({
            title: "User Deleted",
            description: `User ${userToDelete.name} has been permanently deleted.`,
        });

      } catch (error) {
          const e = error as Error;
          toast({
              variant: "destructive",
              title: "Deletion Failed",
              description: e.message
          });
      } finally {
        setUserToDelete(null); // Reset after deletion attempt
      }
    }
  }

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, userId: string) => {
    if ((e.target as HTMLElement).closest('[data-action-cell]')) {
      return;
    }
    router.push(`/admin/users/${userId}`);
  };

  const getSourceBadgeVariant = (source: User['invitedBySource']) => {
    switch (source) {
      case 'ADMIN':
        return 'secondary';
      case 'USER':
        return 'default';
      case 'SELF':
      default:
        return 'outline';
    }
  };


  const renderSkeleton = () => (
    Array.from({ length: USERS_PER_PAGE }).map((_, i) => (
        <TableRow key={`skeleton-${i}`}>
            <TableCell><Skeleton className="h-10 w-40" /></TableCell>
            <TableCell><Skeleton className="h-10 w-48" /></TableCell>
            <TableCell><Skeleton className="h-8 w-16 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-8 w-16 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-8 w-16 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
        </TableRow>
    ))
  );
  
  const isFiltered = searchQuery !== '' || roleFilter !== 'all' || statusFilter !== 'all';

  return (
    <AlertDialog>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <div>
                  <CardTitle>Manage Users</CardTitle>
                  <CardDescription>A list of all registered users.</CardDescription>
              </div>
              <Button asChild>
                  <Link href="/admin/users/add">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New User
                  </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {isFiltered && (
                <Button variant="ghost" onClick={handleClearFilters}>
                  <X className="mr-2 h-4 w-4"/>
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableTableHead
                    label="User"
                    sortKey="name"
                    currentSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableTableHead
                    label="Contact"
                    sortKey="email"
                    currentSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableTableHead
                    label="Role"
                    sortKey="role"
                    currentSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableTableHead
                    label="Status"
                    sortKey="status"
                    currentSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableTableHead
                    label="Source"
                    sortKey="invitedBySource"
                    currentSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableTableHead
                    label="Sign-up Date"
                    sortKey="createdAt"
                    currentSortKey={sortKey}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableTableHead label="Actions" isSortable={false} className="text-right" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    renderSkeleton()
                ) : error ? (
                    <TableRow><TableCell colSpan={7} className="text-center h-24 text-destructive">{error}</TableCell></TableRow>
                ) : paginatedUsers.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center h-24 text-muted-foreground">No users found.</TableCell></TableRow>
                ) : (
                    paginatedUsers.map((user) => (
                    <TableRow key={user.id} onClick={(e) => handleRowClick(e, user.id)} className="cursor-pointer">
                        <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {user.name}
                        </div>
                        </TableCell>
                        <TableCell>
                            <div className="text-sm">{user.email}</div>
                            <div className="text-xs text-muted-foreground">{user.phone}</div>
                        </TableCell>
                        <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'default' : 'outline'}>{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                        <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>{user.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={getSourceBadgeVariant(user.invitedBySource)}>
                                {user.invitedBySource}
                            </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right" data-action-cell>
                        <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={`/admin/users/edit/${user.id}`}>
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Link>
                            </Button>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setUserToDelete(user)} className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </AlertDialogTrigger>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                      <ChevronLeft className="mr-1 h-4 w-4" />
                      Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                      Next
                      <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user account
            and remove their data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
