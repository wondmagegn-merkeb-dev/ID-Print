import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[calc(100vh-80px)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">Loading Admin Dashboard</h2>
        <p className="text-muted-foreground">Please wait while we prepare the admin panel.</p>
      </div>
    </div>
  );
}
