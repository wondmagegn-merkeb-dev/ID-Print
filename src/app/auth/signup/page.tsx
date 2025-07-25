import { SignUpForm } from '@/components/auth/signup-form';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 p-4">
      <div className="max-w-md w-full p-8 bg-card border rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline text-primary">Create an Account</h1>
          <p className="text-muted-foreground mt-2">
            Get started with ID Batcher for free.
          </p>
        </div>
        <SignUpForm />
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
