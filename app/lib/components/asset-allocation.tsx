import { Fragment, useMemo } from "react";

import { getGroupAllocation, groupAssetsByType } from "@/app/lib/utils/asset-list";
import { ASSET_TYPE_TEXT_MAP } from "@/app/lib/constants/asset-types";
import { IAsset } from "@/app/lib/types/assets";

interface IAssetAllocationProps {
  assets: IAsset[];
  className?: string;
}
 
export const AssetAllocation: React.FC<IAssetAllocationProps> = ({ assets, className = '' }) => {
  const groups = useMemo(() => groupAssetsByType(assets), [assets]);

  return (
    <ul className={className}>
      {groups.map(([type, groupAssets]) => (
        <li key={type} className="flex gap-2 items-baseline justify-end">
          <div className="text-sm text-muted-foreground">{ASSET_TYPE_TEXT_MAP[type]}</div>
          <div className="text-sm font-medium leading-none text-right">{getGroupAllocation(assets, groupAssets)}</div>
        </li>
      ))}
    </ul>
  );
}
