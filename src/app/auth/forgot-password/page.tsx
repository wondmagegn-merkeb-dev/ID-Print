import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline text-primary">Forgot Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email to receive a password reset link.
          </p>
        </div>
        <ForgotPasswordForm />
        <div className="text-center mt-4">
          <Link href="/auth/signin" className="text-sm text-primary hover:underline">
            Remembered your password? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
