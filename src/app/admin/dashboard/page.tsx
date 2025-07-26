
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Users, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const users = [
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
    {
        id: "usr_5",
        name: "Bob Brown",
        email: "bob.b@example.com",
        plan: "Basic",
        signupDate: "2023-10-22",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    },
    {
        id: "usr_6",
        name: "Charlie Davis",
        email: "charlie.d@example.com",
        plan: "Pro",
        signupDate: "2023-10-21",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f",
    },
    {
        id: "usr_7",
        name: "Diana Prince",
        email: "diana.p@example.com",
        plan: "Enterprise",
        signupDate: "2023-10-20",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g",
    },
    {
        id: "usr_8",
        name: "Eve Adams",
        email: "eve.a@example.com",
        plan: "Basic",
        signupDate: "2023-10-19",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704h",
    },
];

const USERS_PER_PAGE = 7;

export default function AdminDashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  
  const paginatedUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );
  
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+50 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents Processed</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,678</div>
            <p className="text-xs text-muted-foreground">+200 since last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Usage Credits</CardTitle>
            <BarChart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98,765</div>
            <p className="text-xs text-muted-foreground">Total remaining</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>A list of the most recent users who signed up.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Sign-up Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge variant={user.plan === 'Pro' ? 'default' : user.plan === 'Enterprise' ? 'secondary' : 'outline'}>{user.plan}</Badge></TableCell>
                    <TableCell className="text-right">{user.signupDate}</TableCell>
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
