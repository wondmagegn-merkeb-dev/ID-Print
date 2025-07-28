
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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  price: z.string().min(1, { message: "Price is required (e.g., 500 ETB/month)." }),
  pdfMerges: z.coerce.number().int().positive({ message: "Must be a positive number." }),
  idGenerations: z.coerce.number().int().positive({ message: "Must be a positive number." }),
});

type EditPackageFormProps = {
    packageId: string;
}

export function EditPackageForm({ packageId }: EditPackageFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    async function fetchPackage() {
        try {
            setIsFetching(true);
            const response = await fetch(`/api/admin/packages/${packageId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch package data.");
            }
            const data = await response.json();
            form.reset(data);
        } catch (error) {
            const e = error as Error;
            toast({
                variant: "destructive",
                title: "Error",
                description: e.message || "Could not load package details.",
            });
            router.back();
        } finally {
            setIsFetching(false);
        }
    }
    fetchPackage();
  }, [packageId, form, router, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update package.');
      }

      toast({
        title: "Package Updated",
        description: `Package "${values.name}" has been successfully updated.`,
      });
      router.push('/admin/packages');
      router.refresh();

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
            <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
            </CardFooter>
        </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
            <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Package Name</FormLabel>
                          <FormControl>
                              <Input placeholder="e.g., Pro" {...field} />
                          </FormControl>
                           <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Price (ETB)</FormLabel>
                          <FormControl>
                               <Input placeholder="e.g., 1500 ETB/month or Custom" {...field} />
                          </FormControl>
                           <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pdfMerges"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>PDF Merges</FormLabel>
                          <FormControl>
                               <Input type="number" placeholder="e.g., 1000" {...field} />
                          </FormControl>
                           <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="idGenerations"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>ID Generations</FormLabel>
                          <FormControl>
                               <Input type="number" placeholder="e.g., 2500" {...field} />
                          </FormControl>
                           <FormMessage />
                          </FormItem>
                      )}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving Changes...' : 'Save Changes'}
                </Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
