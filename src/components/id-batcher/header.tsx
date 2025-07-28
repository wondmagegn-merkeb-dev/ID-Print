
"use client";

import { AppLogo } from '@/components/icons';
import { Button } from '../ui/button';
import Link from 'next/link';
import { CreditCard, LogOut, User, FolderClock } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type UserData = {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "User";
    avatar?: string | null;
};

type HeaderProps = {
  credits: number;
  onCreditsChanged: (credits: number) => void;
};

export function Header({ credits, onCreditsChanged }: HeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/signin');
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
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
                <div className="text-xs text-muted-foreground">{isAdmin ? "Unlimited" : `${credits} remaining`}</div>
            </div>
            {user ? (
                 <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                     <Avatar className="h-9 w-9">
                       <AvatarImage src={user.avatar ?? "https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt={user.name} />
                       <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                     </Avatar>
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent className="w-56" align="end" forceMount>
                   <DropdownMenuLabel className="font-normal">
                     <div className="flex flex-col space-y-1">
                       <p className="text-sm font-medium leading-none">{user.name}</p>
                       <p className="text-xs leading-none text-muted-foreground">
                         {user.email}
                       </p>
                     </div>
                   </DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <Link href="/dashboard/profile" passHref>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                   </Link>
                   <Link href="/dashboard/packages" passHref>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Packages</span>
                    </DropdownMenuItem>
                   </Link>
                   <Link href="/dashboard/sessions" passHref>
                    <DropdownMenuItem>
                      <FolderClock className="mr-2 h-4 w-4" />
                      <span>Saved Sessions</span>
                    </DropdownMenuItem>
                   </Link>
                   <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
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
