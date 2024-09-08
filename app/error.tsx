'use client';
 
import { useEffect } from 'react';

import { Button } from '@/app/lib/components/shadcn/ui/button';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex flex-col items-center min-h-screen gap-4 p-24">
      <h1 className="text-lg font-semibold text-center">Что-то пошло не так!</h1>
      <Button onClick={reset}>Перезагрузить</Button>
    </main>
  );
}
