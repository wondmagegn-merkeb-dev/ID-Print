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
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export function SignUpForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function getFirstError(errors: FieldErrors<z.infer<typeof formSchema>>) {
    const fieldOrder: (keyof z.infer<typeof formSchema>)[] = ['name', 'phone', 'email', 'password', 'confirmPassword'];
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
        title: "Account Created",
        description: "You have successfully signed up.",
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
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="John Doe" {...field} className={cn("pl-10", firstError === 'name' && "border-destructive ring-2 ring-destructive/20")} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="(123) 456-7890" {...field} className={cn("pl-10", firstError === 'phone' && "border-destructive ring-2 ring-destructive/20")} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} className={cn("pl-10 pr-10", firstError === 'password' && "border-destructive ring-2 ring-destructive/20")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} className={cn("pl-10 pr-10", firstError === 'confirmPassword' && "border-destructive ring-2 ring-destructive/20")} />
                   <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </Form>
  )
}
