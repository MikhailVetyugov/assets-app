import { STORAGE_KEY } from "@/app/lib/constants/storage";
import { IAsset, IAssetData, TAssetType } from "@/app/lib/types/assets";
import type { TCreateAssetFormSchema } from "@/app/lib/components/create-asset";
import { AssetAlreadyExistsError } from "@/app/lib/utils/errors/alreadyExists";

export function assetsDataExists() {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem(STORAGE_KEY);
  }

  return false;
}

export function saveAsset(asset: TCreateAssetFormSchema) {
  const rawData = localStorage.getItem(STORAGE_KEY);
  const data: IAssetData = rawData ? JSON.parse(rawData) : { assets: [] };

  const alreadyExists = data.assets.some(item => item.name === asset.name && item.type === asset.type);

  if (alreadyExists) {
    throw new AssetAlreadyExistsError('Такой актив уже существует');
  }

  data.assets.push({
    name: asset.name,
    type: asset.type as TAssetType,
    history: [
      {
        cost: asset.cost,
        date: new Date().toLocaleDateString('ru')
      }
    ]
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAssets(): IAsset[] {
  const rawData = localStorage.getItem(STORAGE_KEY);

  return rawData ? JSON.parse(rawData).assets : [];
}
