
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FieldErrors } from "react-hook-form"
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
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"

const formSchema = z.object({
  role: z.enum(["Admin", "User"], { required_error: "Please select a role." }),
  status: z.enum(["Active", "Inactive"], { required_error: "Please select a status." }),
});

type User = {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "User";
    status: "Active" | "Inactive";
};

type EditUserFormProps = {
    user: User;
    onOpenChange: (isOpen: boolean) => void;
    onUserUpdate: (updatedUser: any) => void;
}

export function EditUserForm({ user, onOpenChange, onUserUpdate }: EditUserFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: user.role,
      status: user.status,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${user.id}`, {
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
        description: `${user.name}'s details have been successfully updated.`,
      });
      onUserUpdate({ ...user, ...result });

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

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit User: {user.name}</DialogTitle>
                <DialogDescription>
                    Update the role and status for {user.email}.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
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
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}
