
"use client";

import { useEffect, useState } from 'react';
import type { IdData } from '@/ai/flow';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { FileStack, Trash2 } from 'lucide-react';

type SavedSession = {
  id: string;
  timestamp: number;
  cardCount: number;
  data: IdData[];
};

type SavedSessionsProps = {
  onLoadSession: (data: IdData[]) => void;
};

export function SavedSessions({ onLoadSession }: SavedSessionsProps) {
  const [sessions, setSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    try {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const storedSessions: SavedSession[] = JSON.parse(localStorage.getItem('id-batcher-sessions') || '[]');
      const recentSessions = storedSessions.filter(session => session.timestamp > thirtyDaysAgo);
      
      if (recentSessions.length !== storedSessions.length) {
        localStorage.setItem('id-batcher-sessions', JSON.stringify(recentSessions));
      }
      
      setSessions(recentSessions.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Failed to load sessions from localStorage:', error);
      setSessions([]);
    }
  }, []);

  const handleDelete = (sessionId: string) => {
    const updatedSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(updatedSessions);
    localStorage.setItem('id-batcher-sessions', JSON.stringify(updatedSessions));
  };
  
  if (sessions.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <Separator />
      <Card className="mt-8 border-0 shadow-none">
        <CardHeader className="px-1">
          <CardTitle>Saved Sessions</CardTitle>
          <CardDescription>Load a previously saved batch from the last 30 days.</CardDescription>
        </CardHeader>
        <CardContent className="px-1">
          <ScrollArea className="h-48 pr-4">
            <ul className="space-y-3">
              {sessions.map(session => (
                <li key={session.id} className="flex items-center justify-between p-3 bg-card rounded-lg shadow-sm border">
                    <div className="flex items-center gap-4 overflow-hidden">
                        <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-md shrink-0">
                            <FileStack className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-medium text-sm truncate">
                              Batch of {session.cardCount} cards
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Saved on: {new Date(session.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => onLoadSession(session.data)}>
                            Load
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(session.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                    </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
