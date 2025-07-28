
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ExternalLink, Shield, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type User = {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "User";
    avatar?: string | null;
};

function ReferralCard({ userId }: { userId: string }) {
    const { toast } = useToast();
    const [referralLink, setReferralLink] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setReferralLink(`${window.location.origin}/auth/signup?ref=${userId}`);
        }
    }, [userId]);
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            toast({
                title: "Link Copied!",
                description: "Your referral link has been copied to the clipboard.",
            });
        }, (err) => {
            toast({
                variant: 'destructive',
                title: "Failed to Copy",
                description: "Could not copy the link to your clipboard.",
            });
        });
    };

    if (!referralLink) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Refer a Friend</CardTitle>
                <CardDescription>Invite others and earn rewards!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Input id="referral-link" value={referralLink} readOnly />
                    <Button variant="outline" size="icon" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy link</span>
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Share this link with your friends.
                </p>
            </CardContent>
        </Card>
    )
}

function ProfileSkeleton() {
    return (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <Skeleton className="h-10 w-28" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Skeleton className="h-10 w-36" />
                    </CardFooter>
                </Card>
            </div>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                        <CardDescription>Your current plan and usage.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-6 w-24 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    } else {
        // Handle case where user is not logged in, maybe redirect
        router.push('/auth/signin');
    }
  }, [router]);
  
  // Mock data for things not in user object yet
  const creditsUsed = 1250;
  const creditsTotal = 2500;
  const creditsPercentage = (creditsUsed / creditsTotal) * 100;

  return (
    <div className="space-y-6">
      <header className="mb-6">
          <div className="flex items-center gap-4 mb-2">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                <p className="text-muted-foreground">Manage your account and subscription details.</p>
              </div>
          </div>
      </header>
      <Separator />

      {!user ? <ProfileSkeleton /> : (
        <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid md:grid-cols-2 gap-6 items-start">
              <Card>
                  <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details here.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                      <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar ?? "https://i.pravatar.cc/150?u=a042581f4e29026704d"} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline">Change Photo</Button>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue={user.email} disabled />
                  </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                  <Button>Update Information</Button>
                  </CardFooter>
              </Card>
              
              <Card>
                  <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>Change your password.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                  </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                  <Button>Change Password</Button>
                  </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                        <CardDescription>Your current plan and usage.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {user.role === 'Admin' ? (
                            <div>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="text-lg font-bold text-primary flex items-center gap-2"><Shield /> Admin Plan</h3>
                                </div>
                                <p className="text-sm text-muted-foreground">You have unlimited access to all features.</p>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="text-lg font-bold text-primary">Pro Plan</h3>
                                        <p className="text-lg font-semibold">$29<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Your plan renews on July 1, 2024.</p>
                                </div>
                                <Separator />
                                <div>
                                    <Label className="text-sm font-medium">Usage Credits</Label>
                                    <Progress value={creditsPercentage} className="mt-2 h-2" />
                                    <p className="text-sm text-muted-foreground mt-2">{creditsUsed} of {creditsTotal} credits used.</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/dashboard/packages">
                                {user.role === 'Admin' ? 'View All Packages' : 'Manage Subscription'}
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                {user.role !== 'Admin' && <ReferralCard userId={user.id} />}
            </div>
        </div>
      )}
    </div>
  )
}
