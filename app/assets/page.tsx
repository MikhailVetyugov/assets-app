'use client'

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AssetList } from "@/app/lib/components/asset-list";
import { assetsDataExists, getAssets } from "@/app/lib/services/assets";
import { CreateAsset } from "@/app/lib/components/create-asset";
import { IAsset } from "../lib/types/assets";

export default function AssetsPage() {
  const router = useRouter();

  const [assets, setAssets] = useState<IAsset[]>([]);

  useEffect(() => {
    if (!assetsDataExists()) {
      router.replace('/')
    } else {
      setAssets(getAssets())
    }
  }, [router]);

  const handleAssetsChanged = useCallback(() => {
    setAssets(getAssets())
  }, [router]);

  return (
    <main className="flex flex-col items-center gap-4 min-h-screen p-4">
      <AssetList assets={assets} onAssetsChanged={handleAssetsChanged} />
      <CreateAsset onAssetCreated={handleAssetsChanged} />
    </main>
  );
}
