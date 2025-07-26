
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Users, FileText } from 'lucide-react';

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
];

export default function AdminDashboardPage() {
  const recentUsers = users.slice(0, 3);
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
              {recentUsers.map((user) => (
                <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge variant={user.plan === 'Pro' ? 'default' : user.plan === 'Enterprise' ? 'secondary' : 'outline'}>{user.plan}</Badge></TableCell>
                    <TableCell className="text-right">{user.signupDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
