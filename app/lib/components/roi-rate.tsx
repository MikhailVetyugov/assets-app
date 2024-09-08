import {  useMemo } from "react";

import { groupAssetsByType } from "@/app/lib/utils/asset-list";
import { IAsset } from "@/app/lib/types/assets";
import { getROIRate } from "@/app/lib/utils/roi-rate";
import { toPercent } from "@/app/lib/utils/to-percent";
import { ASSET_TYPE_TEXT_MAP } from "@/app/lib/constants/asset-types";

interface IROIRateProps {
  assets: IAsset[];
  className?: string;
}
 
export const ROIRate: React.FC<IROIRateProps> = ({ assets, className = '' }) => {
  const groups = useMemo(() => groupAssetsByType(assets), [assets]);

  const commonROI = useMemo(() => getROIRate(assets), [assets]);
  const groupsToROI = useMemo(() => groups.map(([type, groupAssets]) => [type, getROIRate(groupAssets)] as const), [groups])

  return (
    <ul className={className}>
      <li className="flex gap-2 items-baseline justify-end">
        <div className="text-sm text-muted-foreground">Среднегодовая доходность всего капитала</div>
        <div className="text-sm font-medium leading-none text-right">{toPercent(commonROI)}</div>
      </li>
      {groupsToROI.map(([type, ROI]) => (
        <li className="flex gap-2 items-baseline justify-end">
          <div className="text-sm text-muted-foreground">Среднегодовая доходность группы {ASSET_TYPE_TEXT_MAP[type]}</div>
          <div className="text-sm font-medium leading-none text-right">{toPercent(ROI)}</div>
        </li>
      ))}
    </ul>
  );
}
