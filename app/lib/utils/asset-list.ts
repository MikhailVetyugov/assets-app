import { IAsset, TAssetType } from "@/app/lib/types/assets";
import { fromLocaleFormat } from "./dates";

const formatter = new Intl.NumberFormat("ru");

export function getDateHeaders(assets: IAsset[]) {
  const dateMap = new Map<string, number>();

  assets.forEach(asset => {
    asset.history.forEach((item) => {
      const date = fromLocaleFormat(item.date);
      dateMap.set(item.date, date.getTime());
    });
  });

  const dates = Array.from(dateMap.keys());

  return dates.sort((first, second) => {
    const firstMs = dateMap.get(first)!;
    const secondMs = dateMap.get(second)!;

    return firstMs - secondMs;
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

function getRawAssetCostForDate(asset: IAsset, date: string) {
  const historyItems = asset.history.filter(item => fromLocaleFormat(item.date) <= fromLocaleFormat(date))
  const cost = historyItems.at(-1)?.cost;

  return cost ?? 0;
}

function getRawTotalCostForDate(assets: IAsset[], date: string) {
  let total = 0;

  assets.forEach(asset => {
    total += getRawAssetCostForDate(asset, date);
  });
  
  return total;
}

export function getAssetCostForDate(asset: IAsset, date: string) {
  const cost = getRawAssetCostForDate(asset, date)

  return cost ? formatter.format(cost) : 0;
}

export function getTotalCostForDate(assets: IAsset[], date: string) {
  const total = getRawTotalCostForDate(assets, date)
  
  return formatter.format(total);
}

export function getGroupAllocation(allAssets: IAsset[], groupAssets: IAsset[]) {
  const date = new Date().toLocaleDateString('ru');

  const total = getRawTotalCostForDate(allAssets, date);

  if (total === 0) {
    return 0;
  }

  const groupTotal = getRawTotalCostForDate(groupAssets, date);

  return groupTotal / total;
}
