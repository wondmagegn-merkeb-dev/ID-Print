"use client";

import { AppLogo } from '@/components/icons';
import { Button } from '../ui/button';
import Link from 'next/link';
import { User } from 'lucide-react';

type HeaderProps = {
  credits: number;
};

export function Header({ credits }: HeaderProps) {
  // Mock user state
  const isLoggedIn = true;

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <AppLogo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-headline">
              ID Batcher
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">Usage Credits</div>
            <div className="text-xs text-muted-foreground">{credits} remaining</div>
          </div>
          {isLoggedIn ? (
            <Button variant="ghost" size="icon">
              <User />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
