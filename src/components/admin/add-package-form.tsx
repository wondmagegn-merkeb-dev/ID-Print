
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
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "../ui/card"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  price: z.string().min(1, { message: "Price is required (e.g., 500 ETB/month)." }),
  pdfMerges: z.coerce.number().int().positive({ message: "Must be a positive number." }),
  idGenerations: z.coerce.number().int().positive({ message: "Must be a positive number." }),
});

export function AddPackageForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
      pdfMerges: 100,
      idGenerations: 500,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create package.');
      }

      toast({
        title: "Package Created",
        description: `Package "${values.name}" has been successfully created.`,
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
                    {isLoading ? 'Creating Package...' : 'Create Package'}
                </Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
