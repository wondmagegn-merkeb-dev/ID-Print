
'use client';

import { EditUserPageForm } from '@/components/admin/edit-user-page-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  if (!id || typeof id !== 'string') {
    return (
      <div>
        <p>Invalid User ID</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="mb-6">
          <div className="flex items-center gap-4 mb-2">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Edit User</h1>
                <p className="text-muted-foreground">Update the user's details below.</p>
              </div>
          </div>
      </header>
      <Separator />
      <EditUserPageForm userId={id} />
    </div>
  );
}
