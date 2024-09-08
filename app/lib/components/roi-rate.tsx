import {  useMemo } from "react";

import { groupAssetsByType } from "@/app/lib/utils/asset-list";
import { IAsset } from "@/app/lib/types/assets";

interface IROIRateProps {
  assets: IAsset[];
  className?: string;
}
 
export const ROIRate: React.FC<IROIRateProps> = ({ assets, className = '' }) => {
  const groups = useMemo(() => groupAssetsByType(assets), [assets]);

  return (
    <ul className={className}>
      <li className="flex gap-2 items-baseline justify-end">
        <div className="text-sm text-muted-foreground">Среднегодовая доходность всего капитала</div>
        <div className="text-sm font-medium leading-none text-right">14%</div>
      </li>
    </ul>
  );
}
