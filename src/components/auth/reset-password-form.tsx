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
import { Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export function ResetPasswordForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  function getFirstError(errors: FieldErrors<z.infer<typeof formSchema>>) {
    const fieldOrder: (keyof z.infer<typeof formSchema>)[] = ['password', 'confirmPassword'];
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
        title: "Password Reset Successful",
        description: "You can now sign in with your new password.",
      })
      setIsLoading(false);
      router.push('/auth/signin');
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} className={cn("pl-10 pr-10", firstError === 'confirmPassword' && "border-destructive ring-2 ring-destructive/20")} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground flex items-center justify-center">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </Form>
  )
}
