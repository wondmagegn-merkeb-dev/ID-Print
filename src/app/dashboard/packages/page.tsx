
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function DashboardPackagesPage() {
  const router = useRouter();

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
      buttonText: "Downgrade to Basic",
      href: "/dashboard/packages?plan=basic",
      variant: "outline"
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
      buttonText: "Your Current Plan",
      href: "/dashboard/packages?plan=pro",
      current: true,
      variant: "default"
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
      href: "/contact-sales",
      variant: "outline"
    },
  ];

  return (
    <div className="space-y-6">
        <header className="mb-6">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Your Subscription</h1>
                    <p className="text-muted-foreground">Upgrade, downgrade or manage your current plan.</p>
                </div>
            </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.current ? 'border-primary ring-2 ring-primary shadow-lg' : ''}`}>
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
                <Button asChild className="w-full" variant={plan.current ? 'default' : 'outline'} disabled={plan.current}>
                    <Link href={plan.href}>{plan.buttonText}</Link>
                </Button>
            </CardFooter>
            </Card>
        ))}
        </div>
    </div>
  );
}
