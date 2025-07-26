
"use client";

import { useEffect, useState } from 'react';
import type { IdData } from '@/ai/flow';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { FileStack, Trash2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { generateExportHtml } from '@/lib/export';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';


type SavedSession = {
  id: string;
  timestamp: number;
  cardCount: number;
  data: IdData[];
};

type SavedSessionsProps = {
  onLoadSession: (data: IdData[]) => void;
};

const SESSIONS_PER_PAGE = 5;

export function SavedSessions({ onLoadSession }: SavedSessionsProps) {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();

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
    if (Math.ceil(updatedSessions.length / SESSIONS_PER_PAGE) < currentPage) {
      setCurrentPage(Math.max(1, currentPage - 1));
    }
  };

  const handleDownload = (session: SavedSession) => {
    const allText = session.data[0]?.rawText || "";
    const textChunks = allText.split(/\s*\n\s*\n\s*/).filter(Boolean);
    const cardData: IdData[] = textChunks.map((chunk, index) => ({
        fileName: `ID ${index + 1}`,
        rawText: chunk,
        name: `ID ${index + 1} from Merged PDF`,
        dateOfBirth: 'N/A',
        otherDetails: chunk,
    }));

    const htmlContent = generateExportHtml(cardData);
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `id_batch_export_${session.id}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRemainingDays = (timestamp: number) => {
    const expiryDate = new Date(timestamp).getTime() + 30 * 24 * 60 * 60 * 1000;
    const remainingTime = expiryDate - Date.now();
    if (remainingTime < 0) return 'Expired';
    const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    return `${remainingDays} day${remainingDays > 1 ? 's' : ''} left`;
  };

  const totalPages = Math.ceil(sessions.length / SESSIONS_PER_PAGE);
  const paginatedSessions = sessions.slice(
    (currentPage - 1) * SESSIONS_PER_PAGE,
    currentPage * SESSIONS_PER_PAGE
  );
  
  if (sessions.length === 0) {
    return (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">You have no saved sessions.</p>
        </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
    <CardContent className="px-1">
        {isMobile ? (
            <div className="space-y-4">
            {paginatedSessions.map(session => (
                <Card key={session.id} className="shadow-md">
                    <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-muted rounded-lg shrink-0">
                        <FileStack className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-base truncate">
                        Batch of {session.cardCount} cards
                        </p>
                        <p className="text-sm text-muted-foreground">
                        Saved: {new Date(session.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-xs font-mono text-primary/80 pt-1">
                        {getRemainingDays(session.timestamp)}
                        </p>
                    </div>
                    </CardContent>
                    <div className="p-4 pt-0 flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(session.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(session)}>
                        <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                    <Button size="sm" onClick={() => onLoadSession(session.data)}>
                        Load
                    </Button>
                    </div>
                </Card>
            ))}
            </div>
        ) : (
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Batch Details</TableHead>
                <TableHead>Saved On</TableHead>
                <TableHead>Expires In</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedSessions.map(session => (
                <TableRow key={session.id}>
                    <TableCell className="font-medium">Batch of {session.cardCount} cards</TableCell>
                    <TableCell>{new Date(session.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{getRemainingDays(session.timestamp)}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => onLoadSession(session.data)}>
                            Load
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDownload(session)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download (.doc)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(session.id)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </div>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        )}

        {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
            </div>
        )}
    </CardContent>
    </Card>
  );
}
