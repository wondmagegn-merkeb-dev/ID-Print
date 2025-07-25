"use client";

import { AppLogo } from '@/components/icons';

type HeaderProps = {
  credits: number;
};

export function Header({ credits }: HeaderProps) {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <AppLogo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-headline">
            ID Batcher
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">Usage Credits</div>
            <div className="text-xs text-muted-foreground">{credits} remaining</div>
          </div>
        </div>
      </div>
    </header>
  );
}
