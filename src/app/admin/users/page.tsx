
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, ChevronLeft, ChevronRight, Pencil, Trash2, LoaderCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
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

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "User";
  status: "Active" | "Inactive";
  signupDate: string; // Assuming API returns this as a string
  avatar?: string | null;
  createdAt: string;
};

const USERS_PER_PAGE = 6;

export default function AdminUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

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

  const renderSkeleton = () => (
    Array.from({ length: USERS_PER_PAGE }).map((_, i) => (
        <TableRow key={`skeleton-${i}`}>
            <TableCell><Skeleton className="h-10 w-40" /></TableCell>
            <TableCell><Skeleton className="h-10 w-48" /></TableCell>
            <TableCell><Skeleton className="h-8 w-16 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-8 w-16 rounded-full" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
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
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sign-up Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                    renderSkeleton()
                ) : error ? (
                    <TableRow><TableCell colSpan={6} className="text-center h-24 text-destructive">{error}</TableCell></TableRow>
                ) : paginatedUsers.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center h-24 text-muted-foreground">No users found.</TableCell></TableRow>
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
