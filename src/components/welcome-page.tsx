"use client";

import { AppLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle } from 'lucide-react';

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
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start">
      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
      <span className="text-muted-foreground">{children}</span>
    </div>
  );
}

export function WelcomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <WelcomeHeader />
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-primary/10 text-primary font-semibold px-4 py-1 rounded-full text-sm">
              Effortless ID Processing
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-headline text-foreground leading-tight">
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

        <div className="text-center mt-24 sm:mt-32">
          <h2 className="text-3xl font-bold font-headline mb-4">Why Choose ID Batcher?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Save time and eliminate tedious manual work with our streamlined process. Perfect for schools, businesses, and organizations of any size.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 bg-card border rounded-xl space-y-3">
              <h3 className="font-bold text-lg">Batch Processing</h3>
              <p className="text-muted-foreground text-sm">Upload multiple ID files at once and process them in a single batch.</p>
            </div>
            <div className="p-6 bg-card border rounded-xl space-y-3">
              <h3 className="font-bold text-lg">Smart Layout</h3>
              <p className="text-muted-foreground text-sm">Automatically arranges front and back sides on separate, print-ready A4 pages.</p>
            </div>
            <div className="p-6 bg-card border rounded-xl space-y-3">
              <h3 className="font-bold text-lg">Multi-Format Support</h3>
              <p className="text-muted-foreground text-sm">Works with common image files (PNG, JPG) and PDFs for maximum flexibility.</p>
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
