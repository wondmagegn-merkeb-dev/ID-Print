
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { AppLogo } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";

function PackagesHeader() {
    const router = useRouter();
    return (
      <header className="bg-background/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-40">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
            </Button>
            <Link href="/" className="flex items-center gap-3">
              <AppLogo className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground font-headline">
                ID Batcher
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="flex items-center p-1 rounded-full bg-primary/10 shadow-sm bg-primary/60 text-primary-foreground hover:bg-primary/80">
                  <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10" asChild>
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

export default function PackagesPage() {
  const plans = [
    {
      name: "Basic",
      price: "$9",
      description: "For individuals and small teams starting out.",
      features: [
        "Up to 500 ID extractions/month",
        "Standard processing speed",
        "A4 layout export",
        "Email support",
      ],
      buttonText: "Choose Basic",
      href: "/auth/signup?plan=basic"
    },
    {
      name: "Pro",
      price: "$29",
      description: "For growing businesses with higher volume needs.",
      features: [
        "Up to 2500 ID extractions/month",
        "Priority processing queue",
        "Custom layout options",
        "Priority email & chat support",
        "API Access"
      ],
      buttonText: "Choose Pro",
      href: "/auth/signup?plan=pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with specific requirements.",
      features: [
        "Unlimited ID extractions",
        "Dedicated infrastructure",
        "Custom branding & templates",
        "Dedicated account manager",
        "On-premise deployment option"
      ],
      buttonText: "Contact Sales",
      href: "/contact-sales"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
        <PackagesHeader />
        <main className="flex-1">
            <div className="container mx-auto px-4 py-16 sm:py-24">
                <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold font-headline text-foreground leading-tight">
                    Find the perfect plan
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
                    Start for free, then upgrade to a plan that fits your needs. All plans come with our core feature set.
                </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                    <Card key={plan.name} className={`flex flex-col ${plan.popular ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}>
                    <CardHeader>
                        <CardTitle className="font-headline text-3xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-6">
                        <div className="text-4xl font-bold">
                        {plan.price}
                        <span className="text-lg font-normal text-muted-foreground">
                            {plan.name !== 'Enterprise' ? '/ month' : ''}
                        </span>
                        </div>
                        <ul className="space-y-3">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-primary" />
                            <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                            <Link href={plan.href}>{plan.buttonText}</Link>
                        </Button>
                    </CardFooter>
                    </Card>
                ))}
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
