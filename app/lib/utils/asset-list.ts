import { IAsset, TAssetType } from "@/app/lib/types/assets";

const formatter = new Intl.NumberFormat("ru");

export function getDateHeaders(assets: IAsset[]) {
  const dateMap = new Map<string, number>();

  assets.forEach(asset => {
    asset.history.forEach((item) => {
      const date = new Date(item.date);
      dateMap.set(item.date, date.getMilliseconds());
    });
  });

  const dates = Array.from(dateMap.keys());

  return dates.sort((first, second) => {
    const firstMs = dateMap.get(first)!;
    const secondMs = dateMap.get(second)!;

    return secondMs - firstMs;
  });
}

export function groupAssetsByType(assets: IAsset[]) {
  const groups = new Map<TAssetType, IAsset[]>();

  assets.forEach(asset => {
    if (groups.has(asset.type)) {
      const groupAssets = groups.get(asset.type)!;

      groups.set(asset.type, [...groupAssets, asset])
    } else {
      groups.set(asset.type, [asset])
    }
  });

  return Array.from(groups.entries());
}

export function getAssetCostForDate(asset: IAsset, date: string) {
  const cost = asset.history.find(item => item.date === date)?.cost;

  return cost ? formatter.format(cost) : 0;
}

export function getTotalCostForDate(assets: IAsset[], date: string) {
  let total = 0;

  assets.forEach(asset => {
    const cost = asset.history.find(item => item.date === date)?.cost;

    if (cost) {
      total += cost;
    }
  });
  
  return formatter.format(total);
}
