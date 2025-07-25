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
  FormMessage,
  useFormField,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Mail } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
})

export function ForgotPasswordForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  function getFirstError(errors: FieldErrors<z.infer<typeof formSchema>>) {
    const fieldOrder: (keyof z.infer<typeof formSchema>)[] = ['email'];
    for (const field of fieldOrder) {
      if (errors[field]) {
        return field;
      }
    }
    return undefined;
  }

  const firstError = getFirstError(form.formState.errors);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values)
    // Mock API call
    setTimeout(() => {
      toast({
        title: "Password Reset Link Sent",
        description: "If an account with that email exists, we've sent a password reset link to it.",
      })
      setIsLoading(false);
      form.reset();
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="your.email@example.com" {...field} className={cn("pl-10", firstError === 'email' && "border-destructive ring-2 ring-destructive/20")} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </Form>
  )
}
