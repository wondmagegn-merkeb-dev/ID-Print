
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Edit, Gift, Mail, Phone, User as UserIcon, Users, CreditCard, Package, BarChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

// Mock data - in a real app, this would be fetched from your API
const MOCK_USER_DATA = {
    id: 'usr_1',
    name: 'John Doe',
    email: 'john.d@example.com',
    phone: '+251912345678',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
    signupDate: '2023-10-26',
    status: 'Active',
    role: 'Admin',
    subscription: {
        plan: 'Pro',
        renewsOn: '2024-08-01',
        usage: {
            creditsUsed: 1250,
            creditsTotal: 2500,
            creditsPercentage: 50,
        },
    },
    paymentHistory: [
        { id: 'pay_1', date: '2024-07-01', amount: '$29.00', status: 'Paid' },
        { id: 'pay_2', date: '2024-06-01', amount: '$29.00', status: 'Paid' },
        { id: 'pay_3', date: '2024-05-01', amount: '$29.00', status: 'Paid' },
    ],
    referredUsers: [
        { id: 'usr_10', name: 'Referral One', email: 'ref1@example.com', signupDate: '2024-02-15', giftReceived: true },
        { id: 'usr_11', name: 'Referral Two', email: 'ref2@example.com', signupDate: '2024-03-20', giftReceived: false },
    ],
};


export default function UserDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    // Fetch user data based on id, here we use mock data
    const user = MOCK_USER_DATA;

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="space-y-6">
            <header className="mb-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </div>
            </header>
            
            <Separator />

            <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="payments">Payment History</TabsTrigger>
                    <TabsTrigger value="referrals">Referrals</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6 pt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>User Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2"><UserIcon className="w-4 h-4 text-muted-foreground" /> <strong>Name:</strong> {user.name}</div>
                                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> <strong>Email:</strong> {user.email}</div>
                                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" /> <strong>Phone:</strong> {user.phone}</div>
                                <div className="flex items-center gap-2"><strong>Status:</strong> <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>{user.status}</Badge></div>
                                <div className="flex items-center gap-2"><strong>Role:</strong> <Badge variant={user.role === 'Admin' ? 'default' : 'outline'}>{user.role}</Badge></div>
                                <div className="flex items-center gap-2"><strong>Joined:</strong> {new Date(user.signupDate).toLocaleDateString()}</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Current Subscription & Usage</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex justify-between items-baseline">
                                <h3 className="text-lg font-bold text-primary flex items-center gap-2"><Package /> {user.subscription.plan} Plan</h3>
                                <p className="text-sm text-muted-foreground">Renews on {user.subscription.renewsOn}</p>
                            </div>
                            <Separator />
                            <div>
                                <Label className="text-sm font-medium flex items-center gap-2 mb-2"><BarChart /> Usage Credits</Label>
                                <Progress value={user.subscription.usage.creditsPercentage} className="h-3" />
                                <p className="text-sm text-muted-foreground mt-2">{user.subscription.usage.creditsUsed} of {user.subscription.usage.creditsTotal} credits used this cycle.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="payments" className="pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                            <CardDescription>All payments made by this user.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Payment ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {user.paymentHistory.map(payment => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-mono">{payment.id}</TableCell>
                                            <TableCell>{payment.date}</TableCell>
                                            <TableCell>{payment.amount}</TableCell>
                                            <TableCell><Badge variant={payment.status === 'Paid' ? 'default' : 'destructive'}>{payment.status}</Badge></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="referrals" className="pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Referred Users</CardTitle>
                            <CardDescription>Users that were invited by {user.name}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Signup Date</TableHead>
                                        <TableHead>Gift Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {user.referredUsers.map(refUser => (
                                        <TableRow key={refUser.id}>
                                            <TableCell className="font-medium">{refUser.name}<br /><span className="text-xs text-muted-foreground">{refUser.email}</span></TableCell>
                                            <TableCell>{refUser.signupDate}</TableCell>
                                            <TableCell>
                                                <Badge variant={refUser.giftReceived ? 'secondary' : 'default'}>
                                                    {refUser.giftReceived ? 'Claimed' : 'Pending'}
                                                </Badge>
                                            </TableCell>
                                             <TableCell className="text-right">
                                                <Button variant="outline" size="sm" disabled={refUser.giftReceived}>
                                                    <Gift className="mr-2 h-4 w-4" />
                                                    Mark as Gifted
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {user.referredUsers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24">No referrals found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="actions" className="pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Actions</CardTitle>
                            <CardDescription>Perform administrative actions on this user account.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <Button variant="outline" onClick={() => router.push(`/admin/users/edit/${id}`)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit User Role/Status
                           </Button>
                           <Button variant="outline">Reset Password</Button>
                           <Button variant="outline">Suspend User</Button>
                           <Button variant="destructive">Delete User</Button>
                        </CardContent>
                    </Card>
                 </TabsContent>
            </Tabs>
        </div>
    );
}
