
'use client';
import { Header } from '@/components/id-batcher/header';
import { UserProvider } from '@/context/user-context';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [credits, setCredits] = useState(100);

  return (
    <UserProvider>
      <div className="flex flex-col h-full bg-background">
        <Header credits={credits} onCreditsChanged={setCredits} />
        <main className="flex-1 container mx-auto px-4 py-3">{children}</main>
      </div>
    </UserProvider>
  );
}
