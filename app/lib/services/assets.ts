import { STORAGE_KEY } from "@/app/lib/constants/storage";
import { IAsset, IAssetData, TAssetType } from "@/app/lib/types/assets";
import type { TCreateAssetFormSchema } from "@/app/lib/components/create-asset";
import { AssetAlreadyExistsError } from "@/app/lib/utils/errors/alreadyExists";
import { TDeletionReason } from "../types/reasons";
import { TDeleteAssetFormSchema } from "../components/delete-asset";

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
        date: new Date().toLocaleDateString('ru'),
        reason: 'created',
      }
    ]
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAssets(): IAsset[] {
  const rawData = localStorage.getItem(STORAGE_KEY);

  return rawData ? JSON.parse(rawData).assets : [];
}

export function deleteAsset(asset: IAsset, form: TDeleteAssetFormSchema) {
  const rawData = localStorage.getItem(STORAGE_KEY);
  const data: IAssetData = rawData ? JSON.parse(rawData) : { assets: [] };

  const { reason } = form;

  switch (reason) {
    case 'error': {
      const newAssets = data.assets.filter(item => !(item.name === asset.name && item.type === asset.type));
      data.assets = newAssets;

      break;
    }
    case 'withdrawn':
    case 'depreciated': {
      // TODO: After migrating to a real DB throw an error if we can't find an item
      const dataAsset = data.assets.find(item => item.name === asset.name && item.type === asset.type)!;

      const currentDate =  new Date().toLocaleDateString('ru');

      const historyItem = dataAsset.history.find(item => item.date === currentDate);
      
      if (historyItem) {
        historyItem.cost = 0;
      } else {
        dataAsset.history.push({
          cost: 0,
          date: new Date().toLocaleDateString('ru'),
          reason,
        });
      }
      
      break;
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
