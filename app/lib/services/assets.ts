import { STORAGE_KEY } from "@/app/lib/constants/storage";
import { IAsset, IAssetData } from "@/app/lib/types/assets";

export function assetsDataExists() {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem(STORAGE_KEY);
  }

  return false;
}

export function saveAsset(asset: Omit<IAsset, 'date'>) {
  const rawData = localStorage.getItem(STORAGE_KEY);
  const data: IAssetData = rawData ? JSON.parse(rawData) : { assets: [] };

  data.assets.push({
    ...asset,
    date: new Date().toISOString(),
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
