
"use client";

import { AppLogo } from '@/components/icons';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
  

type HeaderProps = {
  credits: number;
};

export function Header({ credits }: HeaderProps) {
  // Mock user state
  const isLoggedIn = true;

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
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
            <ThemeToggle />
            <div className="text-right">
                <div className="text-sm font-medium text-foreground">Usage Credits</div>
                <div className="text-xs text-muted-foreground">{credits} remaining</div>
            </div>
            {isLoggedIn ? (
                 <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                     <Avatar className="h-9 w-9">
                       <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@user" />
                       <AvatarFallback>U</AvatarFallback>
                     </Avatar>
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent className="w-56" align="end" forceMount>
                   <DropdownMenuLabel className="font-normal">
                     <div className="flex flex-col space-y-1">
                       <p className="text-sm font-medium leading-none">User</p>
                       <p className="text-xs leading-none text-muted-foreground">
                         user@example.com
                       </p>
                     </div>
                   </DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem>
                     <User className="mr-2 h-4 w-4" />
                     <span>Profile</span>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem>
                     <LogOut className="mr-2 h-4 w-4" />
                     <Link href="/auth/signin">Sign Out</Link>
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
            ) : (
                <div className="flex items-center p-1 rounded-full bg-muted shadow-sm">
                    <Button variant="ghost" size="sm" className="rounded-full hover:bg-accent/50" asChild>
                    <Link href="/auth/signin">Sign In</Link>
                    </Button>
                    <Button size="sm" className="rounded-full" asChild>
                    <Link href="/auth/signup">Sign Up</Link>
                    </Button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}
