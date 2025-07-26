
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const initialPayments = [
  {
    id: "pay_1",
    user: { name: "John Doe", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a" },
    amount: "$29.00",
    date: "2024-07-01",
    status: "Paid",
    plan: "Pro",
  },
  {
    id: "pay_2",
    user: { name: "Jane Smith", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b" },
    amount: "$9.00",
    date: "2024-07-01",
    status: "Paid",
    plan: "Basic",
  },
  {
    id: "pay_3",
    user: { name: "Sam Wilson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c" },
    amount: "$29.00",
    date: "2024-06-30",
    status: "Paid",
    plan: "Pro",
  },
  {
    id: "pay_4",
    user: { name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    amount: "$299.00",
    date: "2024-06-29",
    status: "Paid",
    plan: "Enterprise (Annual)",
  },
  {
    id: "pay_5",
    user: { name: "Bob Brown", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e" },
    amount: "$9.00",
    date: "2024-06-28",
    status: "Failed",
    plan: "Basic",
  },
  {
    id: "pay_6",
    user: { name: "Charlie Davis", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f" },
    amount: "$29.00",
    date: "2024-06-28",
    status: "Paid",
    plan: "Pro",
  },
  {
    id: "pay_7",
    user: { name: "Diana Prince", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g" },
    amount: "$299.00",
    date: "2024-06-27",
    status: "Paid",
    plan: "Enterprise (Annual)",
  },
];

const PAYMENTS_PER_PAGE = 7;

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(payments.length / PAYMENTS_PER_PAGE);
  const paginatedPayments = payments.slice(
    (currentPage - 1) * PAYMENTS_PER_PAGE,
    currentPage * PAYMENTS_PER_PAGE
  );
  
  const handleAction = (action: string, paymentId: string) => {
    alert(`${action} action triggered for payment ${paymentId}`);
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Payments</CardTitle>
              <CardDescription>A list of all recent transactions.</CardDescription>
            </div>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={payment.user.avatar} alt={payment.user.name} />
                            <AvatarFallback>{payment.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {payment.user.name}
                    </div>
                  </TableCell>
                  <TableCell>{payment.plan}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>
                      <Badge variant={payment.status === 'Paid' ? 'default' : 'destructive'}>
                        {payment.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleAction('View Details', payment.id); }}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleAction('View User', payment.id); }}>View User</DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleAction('Refund', payment.id); }}>Refund</DropdownMenuItem>
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
