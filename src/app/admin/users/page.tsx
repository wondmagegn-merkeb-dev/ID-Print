
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import Link from 'next/link';

const initialUsers = [
    {
      id: "usr_1",
      name: "John Doe",
      email: "john.d@example.com",
      phone: "+251912345678",
      role: "Admin",
      plan: "Pro",
      signupDate: "2023-10-26",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a",
    },
    {
      id: "usr_2",
      name: "Jane Smith",
      email: "jane.s@example.com",
      phone: "+251711223344",
      role: "User",
      plan: "Basic",
      signupDate: "2023-10-25",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
    },
    {
      id: "usr_3",
      name: "Sam Wilson",
      email: "sam.w@example.com",
      phone: "+251922334455",
      role: "User",
      plan: "Pro",
      signupDate: "2023-10-24",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c",
    },
    {
        id: "usr_4",
        name: "Alice Johnson",
        email: "alice.j@example.com",
        phone: "+251933445566",
        role: "User",
        plan: "Enterprise",
        signupDate: "2023-10-23",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
        id: "usr_5",
        name: "Bob Brown",
        email: "bob.b@example.com",
        phone: "+251712345678",
        role: "User",
        plan: "Basic",
        signupDate: "2023-10-22",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    },
    {
        id: "usr_6",
        name: "Charlie Davis",
        email: "charlie.d@example.com",
        phone: "+251911223344",
        role: "User",
        plan: "Pro",
        signupDate: "2023-10-21",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    },
    {
        id: "usr_7",
        name: "Diana Prince",
        email: "diana.p@example.com",
        phone: "+251921345678",
        role: "Admin",
        plan: "Enterprise",
        signupDate: "2023-10-20",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g",
    },
    {
        id: "usr_8",
        name: "Eve Adams",
        email: "eve.a@example.com",
        phone: "+251733445566",
        role: "User",
        plan: "Basic",
        signupDate: "2023-10-19",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704h",
    },
];

const USERS_PER_PAGE = 6;

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      
      const newTotalPages = Math.ceil(updatedUsers.length / USERS_PER_PAGE);
      if (currentPage > newTotalPages) {
          setCurrentPage(Math.max(1, newTotalPages));
      }
    }
  }
  
  const handleEdit = (userId: string) => alert(`This would open a dialog to edit user ${userId}.`);
  const viewDetails = (userId: string) => alert(`This would show more details for user ${userId}.`);


  return (
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
                <TableHead>Plan</TableHead>
                <TableHead>Sign-up Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
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
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                      <Badge variant={user.plan === 'Pro' ? 'default' : user.plan === 'Enterprise' ? 'secondary' : 'outline'}>
                        {user.plan}
                      </Badge>
                  </TableCell>
                  <TableCell>{user.signupDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleEdit(user.id); }}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); viewDetails(user.id); }}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleDelete(user.id); }} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
  );
}
