
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useState } from 'react';

const initialPlans = [
    {
      name: "Basic",
      price: "$9/month",
      description: "For individuals and small teams.",
      features: "500 extractions/month",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29/month",
      description: "For growing businesses.",
      features: "2500 extractions/month",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations.",
      features: "Unlimited extractions",
      popular: false,
    },
];

export default function AdminPackagesPage() {
  const [plans, setPlans] = useState(initialPlans);

  const handleDelete = (planName: string) => {
    if (window.confirm(`Are you sure you want to delete the ${planName} package?`)) {
        setPlans(plans.filter(p => p.name !== planName));
    }
  }
  
  const handleAdd = () => alert('This would open a dialog to add a new package.');
  const handleEdit = (planName: string) => alert(`This would open a dialog to edit the ${planName} package.`);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>Manage Packages</CardTitle>
                <CardDescription>A list of all subscription packages.</CardDescription>
            </div>
            <Button onClick={handleAdd}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Package
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.name}>
                  <TableCell className="font-medium">
                    {plan.name}
                    {plan.popular && <Badge variant="outline" className="ml-2">Popular</Badge>}
                  </TableCell>
                  <TableCell>{plan.price}</TableCell>
                  <TableCell>{plan.features}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleEdit(plan.name); }}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onSelect={(e) => { e.preventDefault(); handleDelete(plan.name); }} className="text-destructive">Delete</DropdownMenuItem>
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
