
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ExternalLink, Shield, Copy, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

function ReferralCard({ userId }: { userId: string }) {
    const { toast } = useToast();
    const referralLink = `${window.location.origin}/auth/signup?ref=${userId}`;
    
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

export default function ProfilePage() {
  const router = useRouter();
  
  // Mock user and admin state - In a real app, this ID would come from the authenticated user's session
  const userId = "usr_123_abc"; 
  const userEmail = "user@example.com"; 
  const isAdmin = userEmail === "admin@example.com";

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

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  <AvatarFallback>{isAdmin ? 'A' : 'U'}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={isAdmin ? "Admin User" : "User"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={isAdmin ? "admin@example.com" : "user@example.com"} disabled />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Update Information</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password. Leave fields blank to keep your current password.</CardDescription>
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
                    {isAdmin ? (
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
                            {isAdmin ? 'View All Packages' : 'Manage Subscription'}
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
             {!isAdmin && <ReferralCard userId={userId} />}
        </div>
      </div>
    </div>
  )
}
