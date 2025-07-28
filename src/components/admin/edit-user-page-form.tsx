
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "@/components/ui/label";
import { Mail, User } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

const formSchema = z.object({
  role: z.enum(["Admin", "User"], { required_error: "Please select a role." }),
  status: z.enum(["Active", "Inactive"], { required_error: "Please select a status." }),
});

type UserData = {
    name: string;
    email: string;
    role: "Admin" | "User";
    status: "Active" | "Inactive";
};

type EditUserPageFormProps = {
    userId: string;
}

export function EditUserPageForm({ userId }: EditUserPageFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        setIsFetching(true);
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.message || "Failed to fetch user data.");
        }
        const user = await response.json();
        setUserData(user);
        form.reset({
          role: user.role,
          status: user.status,
        });
      } catch (error) {
        const e = error as Error;
        toast({
          variant: "destructive",
          title: "Error",
          description: e.message || "Could not load user details.",
        });
        router.back();
      } finally {
        setIsFetching(false);
      }
    }
    fetchUser();
  }, [userId, form, router, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update user.');
      }

      toast({
        title: "User Updated",
        description: `${userData?.name}'s details have been successfully updated.`,
      });
      router.push('/admin/users');

    } catch (error) {
      const e = error as Error;
      toast({
        variant: "destructive",
        title: "Error",
        description: e.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
    )
  }

  if (!userData) {
      return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
            <CardHeader>
                <CardTitle>{userData.name}</CardTitle>
                <CardDescription>
                    Update the role and status for {userData.email}.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Full Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input value={userData.name} disabled className="pl-10" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Email Address</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input value={userData.email} disabled className="pl-10" />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="User">User</SelectItem>
                                </SelectContent>
                            </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
