'use client'

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { assetsDataExists } from "@/app/lib/services/assets";
import { CreateAsset } from '@/app/lib/components/create-asset';

export default function StartScreenPage() {
  const router = useRouter();

  useEffect(() => {
    if (assetsDataExists()) {
      router.replace('/assets')
    }
  }, [router]);

  const handleAssetsCreated = useCallback(() => {
    router.replace('/assets');
  }, [router]);

  return (
    <main className="flex flex-col items-center min-h-screen gap-4 p-24">
      <div className="text-lg font-semibold">Сначала добавьте активы</div>
      <CreateAsset onAssetCreated={handleAssetsCreated} />
    </main>
  );
}
