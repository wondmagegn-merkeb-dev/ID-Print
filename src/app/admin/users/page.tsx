
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
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

const initialUsers = [
    {
      id: "usr_1",
      name: "John Doe",
      email: "john.d@example.com",
      phone: "+251912345678",
      role: "Admin",
      status: "Active",
      signupDate: "2023-10-26",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a",
    },
    {
      id: "usr_2",
      name: "Jane Smith",
      email: "jane.s@example.com",
      phone: "+251711223344",
      role: "User",
      status: "Active",
      signupDate: "2023-10-25",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
    },
    {
      id: "usr_3",
      name: "Sam Wilson",
      email: "sam.w@example.com",
      phone: "+251922334455",
      role: "User",
      status: "Inactive",
      signupDate: "2023-10-24",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c",
    },
    {
        id: "usr_4",
        name: "Alice Johnson",
        email: "alice.j@example.com",
        phone: "+251933445566",
        role: "User",
        status: "Active",
        signupDate: "2023-10-23",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
        id: "usr_5",
        name: "Bob Brown",
        email: "bob.b@example.com",
        phone: "+251712345678",
        role: "User",
        status: "Active",
        signupDate: "2023-10-22",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    },
    {
        id: "usr_6",
        name: "Charlie Davis",
        email: "charlie.d@example.com",
        phone: "+251911223344",
        role: "User",
        status: "Inactive",
        signupDate: "2023-10-21",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    },
    {
        id: "usr_7",
        name: "Diana Prince",
        email: "diana.p@example.com",
        phone: "+251921345678",
        role: "Admin",
        status: "Active",
        signupDate: "2023-10-20",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g",
    },
    {
        id: "usr_8",
        name: "Eve Adams",
        email: "eve.a@example.com",
        phone: "+251733445566",
        role: "User",
        status: "Active",
        signupDate: "2023-10-19",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704h",
    },
    {
      id: "usr_9",
      name: "Frank Miller",
      email: "frank.m@example.com",
      phone: "+251944556677",
      role: "User",
      status: "Active",
      signupDate: "2023-10-18",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704i",
    },
    {
      id: "usr_10",
      name: "Grace Lee",
      email: "grace.l@example.com",
      phone: "+251755667788",
      role: "User",
      status: "Inactive",
      signupDate: "2023-10-17",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704j",
    },
    {
      id: "usr_11",
      name: "Henry Clark",
      email: "henry.c@example.com",
      phone: "+251966778899",
      role: "User",
      status: "Active",
      signupDate: "2023-10-16",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704k",
    },
    {
      id: "usr_12",
      name: "Ivy Walker",
      email: "ivy.w@example.com",
      phone: "+251777889900",
      role: "User",
      status: "Active",
      signupDate: "2023-10-15",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704l",
    },
];

type User = typeof initialUsers[0];

const USERS_PER_PAGE = 6;

export default function AdminUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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
              title: "Error",
              description: e.message || "An unknown error occurred.",
          });
      } finally {
        setUserToDelete(null); // Reset after deletion
      }
    }
  }

  const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, userId: string) => {
    // Only navigate if the click is not on a button or a link inside the action cell
    if ((e.target as HTMLElement).closest('[data-action-cell]')) {
      return;
    }
    router.push(`/admin/users/${userId}`);
  };

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
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} onClick={(e) => handleRowClick(e, user.id)} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
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
                    <TableCell>{user.signupDate}</TableCell>
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
                ))}
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
