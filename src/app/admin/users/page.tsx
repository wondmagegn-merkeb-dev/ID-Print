
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

const initialUsers = [
    {
      id: "usr_1",
      name: "John Doe",
      email: "john.d@example.com",
      plan: "Pro",
      signupDate: "2023-10-26",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a",
    },
    {
      id: "usr_2",
      name: "Jane Smith",
      email: "jane.s@example.com",
      plan: "Basic",
      signupDate: "2023-10-25",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
    },
    {
      id: "usr_3",
      name: "Sam Wilson",
      email: "sam.w@example.com",
      plan: "Pro",
      signupDate: "2023-10-24",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c",
    },
    {
        id: "usr_4",
        name: "Alice Johnson",
        email: "alice.j@example.com",
        plan: "Enterprise",
        signupDate: "2023-10-23",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);

  const handleDelete = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  }
  
  // Add/Edit functions would open a dialog/modal in a real app
  const handleAdd = () => alert('This would open a dialog to add a new user.');
  const handleEdit = (userId: string) => alert(`This would open a dialog to edit user ${userId}.`);


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>A list of all registered users.</CardDescription>
            </div>
            <Button onClick={handleAdd}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Sign-up Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
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
                  <TableCell>{user.email}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(user.id)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
