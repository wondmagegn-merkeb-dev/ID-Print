
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
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string()
    .length(9, { message: "Phone number must be exactly 9 digits." })
    .regex(/^[79]\d{8}$/, { message: "Phone number must start with 7 or 9." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
  invitedById: z.string().optional(),
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
  const searchParams = useSearchParams();
  const refId = searchParams.get('ref');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      invitedById: refId || undefined,
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const fullPhoneNumber = `+251${values.phone}`;
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...values, phone: fullPhoneNumber }),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "An unknown error occurred.");
        }
        toast({
            title: "Account Created",
            description: "You have successfully signed up. Please sign in.",
        });
        router.push('/auth/signin');
    } catch (error) {
        const e = error as Error;
        toast({
            variant: "destructive",
            title: "Sign-up Failed",
            description: e.message,
        });
    } finally {
        setIsLoading(false);
    }
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
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pr-2 border-r border-input">+251</span>
                  <Input 
                    type="tel"
                    placeholder="912345678" 
                    {...field} 
                    onChange={(e) => {
                        const { value } = e.target;
                        if (/^\d*$/.test(value)) {
                            field.onChange(value);
                        }
                    }}
                    className={cn("pl-24", firstError === 'phone' && "border-destructive ring-2 ring-destructive/20")} 
                  />
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
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                   <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
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
