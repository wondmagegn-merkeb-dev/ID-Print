
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your application settings here.</CardDescription>
            </CardHeader>
            <CardContent>
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="api">API Keys</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>General Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="appName">Application Name</Label>
                                <Input id="appName" defaultValue="ID Batcher" />
                            </div>
                             <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label>Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Temporarily disable access to the app for users.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="api" className="pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>API Keys</CardTitle>
                            <CardDescription>Manage API keys for integrated services.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="google-api">Google AI API Key</Label>
                                <Input id="google-api" type="password" defaultValue="******************" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stripe-api">Stripe API Key</Label>
                                <Input id="stripe-api" type="password" defaultValue="******************" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="billing" className="pt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Billing Settings</CardTitle>
                             <CardDescription>Configure payment and subscription settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label>Enable Subscriptions</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Allow users to subscribe to plans.
                                    </p>
                                </div>
                                <Switch defaultChecked/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="currency">Default Currency</Label>
                                <Input id="currency" defaultValue="USD" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            </CardContent>
        </Card>
        <div className="flex justify-end">
            <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
            </Button>
        </div>
    </div>
  );
}
