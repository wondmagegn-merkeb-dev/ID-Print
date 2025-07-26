"use client";

import { AppLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

function WelcomeHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <AppLogo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-headline">
              ID Batcher
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/packages" className='text-sm font-medium text-muted-foreground hover:text-primary transition-colors'>
                Pricing
            </Link>
            <ThemeToggle />
            <div className="flex items-center p-1 rounded-full bg-primary/10 shadow-sm">
                <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 text-primary hover:text-primary" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button size="sm" className="rounded-full" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}

export function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <WelcomeHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 sm:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <div className="inline-block bg-primary/10 text-primary font-semibold px-4 py-1 rounded-full text-sm animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Effortless ID Processing
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold font-headline text-foreground leading-tight animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-100">
                Automate Your ID Card Workflow
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                Effortlessly convert your ID scans into organized documents. Upload your PDF or image files, and let ID Batcher format them into a professional A4 layout, ready for export.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-300">
                <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                    <Link href="/auth/signup">
                    Get Started
                    <ArrowRight className="ml-2" />
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/auth/signin">
                    I have an account
                    </Link>
                </Button>
                </div>
            </div>
            <div className="relative animate-in fade-in zoom-in-50 duration-1000 delay-400 flex justify-center items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-10 blur-3xl rounded-full"></div>
                <div className='w-[100%] md:w-[70%] h-auto aspect-[44/40] item-center justify-center relative rounded-2xl bg-transparent transition-transform duration-500 ease-in-out hover:scale-105'>
                  <Image
                    src="/hero-fyda.png"
                    alt="ID Batcher workflow illustration"
                    fill
                    className="object-contain rounded-2xl shadow-2xl"
                  />
                </div>
            </div>
            </div>
        </div>
      </main>
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} ID Batcher. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
