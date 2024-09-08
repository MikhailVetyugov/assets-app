import { IAsset } from "@/app/lib/types/assets";
import { UPDATE_REASONS } from "../constants/reasons";

export function getLastAssetCost(asset: IAsset) {
  return asset.history.at(-1)?.cost ?? 0;
}

export function getUpdateReasons(oldCost: number, newCost: number) {
  if (oldCost < newCost) {
    return UPDATE_REASONS.filter(item => item.value !== 'withdraw');
  }

  if (oldCost > newCost) {
    return UPDATE_REASONS.filter(item => item.value !== 'deposit');
  }

  return UPDATE_REASONS;
}
