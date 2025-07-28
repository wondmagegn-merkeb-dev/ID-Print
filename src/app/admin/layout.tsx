
'use client'

import { AppLogo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Home, Package, Settings, Users, User, CreditCard, Repeat, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { UserProvider } from '@/context/user-context';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

const menuItems = [
    { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { href: "/admin/users", icon: Users, label: "Users" },
    { href: "/admin/subscriptions", icon: Repeat, label: "Subscriptions" },
    { href: "/admin/payments", icon: CreditCard, label: "Payments" },
    { href: "/admin/packages", icon: Package, label: "Packages" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
]

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const activeItem = menuItems.find(item => pathname.startsWith(item.href));

  const handleLogout = () => {
    logout();
  };

  return (
     <SidebarProvider>
      <Sidebar side="left" variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <AppLogo className="h-7 w-7 text-primary" />
            <span className="text-lg font-semibold">ID Batcher Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton href={item.href} isActive={pathname.startsWith(item.href)} tooltip={item.label}>
                        <item.icon />
                        <span>{item.label}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
            <div className="flex items-center justify-between gap-2 p-2">
                <div className='flex items-center gap-2'>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="flex flex-col gap-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    ) : user ? (
                       <>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar ?? "https://github.com/shadcn.png"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{user.name}</span>
                            <div className="flex gap-2 text-xs">
                                <Link href="/admin/profile" className="text-muted-foreground hover:underline">
                                    Profile
                                </Link>
                            </div>
                        </div>
                       </>
                    ) : null}
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Sign Out</span>
                </Button>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 round-md backdrop-blur-sm px-6 sticky top-0 z-30 md:rounded-t-xl">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                <h1 className="text-lg font-semibold">{activeItem?.label || 'Admin'}</h1>
            </div>
            <ThemeToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </UserProvider>
    )
}
