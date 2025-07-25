import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-headline text-primary">Reset Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your new password below.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
