
'use client';

import { SavedSessions } from "@/components/id-batcher/saved-sessions";
import type { IdData } from "@/ai/flow";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function SessionsPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleLoadSession = (data: IdData[]) => {
        try {
            // Use a specific key for loading a session
            localStorage.setItem('id-batcher-load-session', JSON.stringify(data));
            router.push('/dashboard');
        } catch (error) {
            console.error('Failed to save session to localStorage for loading:', error);
            toast({
                variant: 'destructive',
                title: 'Loading Failed',
                description: 'Could not load the session due to a browser storage issue.',
            });
        }
    };

    return (
        <div className="container mx-auto py-6">
            <header className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Back</span>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Saved Sessions</h1>
                </div>
                <p className="text-muted-foreground ml-14">Manage your saved ID batches from the last 30 days.</p>
            </header>
            <SavedSessions onLoadSession={handleLoadSession} />
        </div>
    );
}
