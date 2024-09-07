import { Fragment, useMemo } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/lib/components/shadcn/ui/table"
import { getAssetCostForDate, getDateHeaders, getTotalCostForDate, groupAssetsByType } from "@/app/lib/utils/asset-list";
import { ASSET_TYPE_TEXT_MAP } from "@/app/lib/constants/asset-types";
import { IAsset } from "@/app/lib/types/assets";
import { DeleteAsset } from "@/app/lib/components/delete-asset";
import { UpdateAsset } from "@/app/lib/components/update-asset";

interface IAssetListProps {
  assets: IAsset[];
  onAssetsChanged: () => void;
}
 
export const AssetList: React.FC<IAssetListProps> = ({ assets, onAssetsChanged }) => {
  const dates = useMemo(() => getDateHeaders(assets), [assets]);
  const groups = useMemo(() => groupAssetsByType(assets), [assets]);

  return (
    <Table className="table-fixed">
      <TableCaption className="caption-top">Ваши активы</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]" />
          <TableHead className="max-w-[250px]" />
          {dates.map(date => <TableHead key={date} className="text-right w-[120px]">{date}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map(([type, assets]) => {
          return (
            <Fragment key={type}>
              <TableRow key={type}>
                <TableCell className="w-[60px]" />
                <TableCell className="font-bold max-w-[250px]">{ASSET_TYPE_TEXT_MAP[type]}</TableCell>
                {dates.map(date => <TableCell className="w-[120px]" key={date} />)}
              </TableRow>

              {assets.map((asset, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell className="w-[60px] flex gap-1">
                      <UpdateAsset asset={asset} onAssetUpdated={onAssetsChanged} />
                      <DeleteAsset asset={asset} onAssetDeleted={onAssetsChanged} />
                    </TableCell>
                    <TableCell className="max-w-[250px]">{asset.name}</TableCell>
                    {dates.map(date => {
                      return <TableCell key={date} className="text-right w-[120px]">{getAssetCostForDate(asset, date)}</TableCell>;
                    })}
                  </TableRow>
                );
              })}
            </Fragment>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="w-[60px]" />
          <TableCell className="font-bold max-w-[250px]">Итого</TableCell>
          {dates.map(date => {
            return <TableCell key={date} className="font-bold text-right w-[120px]">{getTotalCostForDate(assets, date)}</TableCell>;
          })}
        </TableRow>
      </TableFooter>
    </Table>
  )
}
