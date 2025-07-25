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
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Please enter your password." }),
})

export function SignInForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function getFirstError(errors: FieldErrors<z.infer<typeof formSchema>>) {
    const fieldOrder: (keyof z.infer<typeof formSchema>)[] = ['email', 'password'];
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
    console.log(values);
    // Mock API call
    setTimeout(() => {
      toast({
        title: "Sign In Successful",
        description: "Welcome back!",
      })
      setIsLoading(false);
      router.push('/dashboard');
    }, 1000);
  }
  
  function onInvalid(errors: FieldErrors<z.infer<typeof formSchema>>) {
    const firstErrorField = getFirstError(errors);
    if (firstErrorField) {
      const errorMessage = errors[firstErrorField]?.message;
      if (errorMessage && typeof errorMessage === 'string') {
        toast({
            variant: "destructive",
            title: "Invalid Input",
            description: errorMessage,
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                <Link href="/auth/forgot-password" passHref>
                  <span className="text-sm text-primary hover:underline cursor-pointer">Forgot?</span>
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className={cn("pl-10 pr-10", firstError === 'password' && "border-destructive ring-2 ring-destructive/20")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground flex items-center justify-center">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  )
}
