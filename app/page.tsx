'use client'

import { useCallback, useEffect, useState } from "react";

import { assetsDataExists } from "@/app/lib/services/assets";
import { CreateAsset } from '@/app/lib/components/create-asset';

export default function Home() {
  const [hasAssets, setHasAssets] = useState(false);

  useEffect(() => setHasAssets(assetsDataExists()), []);

  const handleAssetsCreated = useCallback(() => setHasAssets(true), []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 p-24">
      {hasAssets
        ? <div>Capital Details</div>
        : <div>Сначала создайте активы</div>
      }
       <CreateAsset onAssetCreated={handleAssetsCreated} />
    </main>
  );
}
