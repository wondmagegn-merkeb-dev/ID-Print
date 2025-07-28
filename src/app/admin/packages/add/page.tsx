
'use client';

import { AddPackageForm } from '@/components/admin/add-package-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddPackagePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <header className="mb-6">
          <div className="flex items-center gap-4 mb-2">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Add New Package</h1>
                <p className="text-muted-foreground">Fill out the form below to create a new subscription package.</p>
              </div>
          </div>
      </header>
      <Separator />
      <AddPackageForm />
    </div>
  );
}
