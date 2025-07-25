import { SignInForm } from '@/components/auth/signin-form';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline text-primary">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to continue to ID Batcher.
          </p>
        </div>
        <SignInForm />
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
