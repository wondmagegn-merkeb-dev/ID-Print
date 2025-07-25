"use client";

import { AppLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

function WelcomeHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <AppLogo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-headline">
              ID Batcher
            </h1>
          </Link>
        </div>
        <div className="flex items-center p-1 rounded-full border bg-background shadow-sm">
          <Button variant="ghost" size="sm" className="rounded-full hover:bg-accent/50" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button size="sm" className="rounded-full" asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
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
                <div className="inline-block bg-primary/10 text-primary font-semibold px-4 py-1 rounded-full text-sm">
                Effortless ID Processing
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold font-headline text-foreground leading-tight">
                Automate Your ID Card Workflow
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                Tired of manually formatting ID cards? ID Batcher takes your individual ID images or PDFs and automatically arranges them onto A4 sheets, ready for printing.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                    <Link href="/auth/signup">
                    Get Started for Free <ArrowRight className="ml-2" />
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="/auth/signin">
                    I have an account
                    </Link>
                </Button>
                </div>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-10 blur-3xl rounded-full"></div>
                <Image
                src="https://placehold.co/600x400.png"
                alt="ID Batcher workflow illustration"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl relative"
                data-ai-hint="id card workflow"
                />
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
