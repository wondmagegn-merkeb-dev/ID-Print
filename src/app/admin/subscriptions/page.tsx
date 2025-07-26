
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const initialSubscriptions = [
  {
    id: "sub_1",
    user: { name: "John Doe", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a" },
    plan: "Pro",
    status: "Active",
    renewsOn: "2024-08-01",
  },
  {
    id: "sub_2",
    user: { name: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b" },
    plan: "Basic",
    status: "Active",
    renewsOn: "2024-08-01",
  },
  {
    id: "sub_3",
    user: { name: "Sam Wilson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c" },
    plan: "Pro",
    status: "Canceled",
    renewsOn: "2024-07-30",
  },
  {
    id: "sub_4",
    user: { name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    plan: "Enterprise",
    status: "Active",
    renewsOn: "2025-06-29",
  },
  {
    id: "sub_5",
    user: { name: "Mike Ross", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f" },
    plan: "Pro",
    status: "Past Due",
    renewsOn: "2024-07-15",
  },
  {
    id: "sub_6",
    user: { name: "Bob Brown", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e" },
    plan: "Basic",
    status: "Active",
    renewsOn: "2024-08-10",
  },
  {
    id: "sub_7",
    user: { name: "Charlie Davis", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g" },
    plan: "Pro",
    status: "Active",
    renewsOn: "2024-08-12",
  },
  {
    id: "sub_8",
    user: { name: "Diana Prince", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704h" },
    plan: "Enterprise",
    status: "Active",
    renewsOn: "2025-07-20",
  },
];

const SUBSCRIPTIONS_PER_PAGE = 6;

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(subscriptions.length / SUBSCRIPTIONS_PER_PAGE);
  const paginatedSubscriptions = subscriptions.slice(
    (currentPage - 1) * SUBSCRIPTIONS_PER_PAGE,
    currentPage * SUBSCRIPTIONS_PER_PAGE
  );
  
  const handleAction = (action: string, subId: string) => {
    alert(`${action} action triggered for subscription ${subId}`);
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>A list of all user subscriptions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Renews On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={sub.user.avatar} alt={sub.user.name} />
                            <AvatarFallback>{sub.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {sub.user.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sub.plan === 'Pro' ? 'default' : sub.plan === 'Enterprise' ? 'secondary' : 'outline'}>
                        {sub.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                      <Badge variant={sub.status === 'Active' ? 'default' : 'destructive'} className={sub.status === 'Canceled' ? 'bg-yellow-500' : ''}>
                        {sub.status}
                      </Badge>
                  </TableCell>
                  <TableCell>{sub.renewsOn}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleAction('View Details', sub.id); }}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleAction('Cancel Subscription', sub.id); }}>Cancel Subscription</DropdownMenuItem>
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
