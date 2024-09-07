import { Fragment } from "react";

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
import { getAssets } from "@/app/lib/services/assets"
import { getAssetCostForDate, getDateHeaders, getTotalCostForDate, groupAssetsByType } from "@/app/lib/utils/asset-list";
import { ASSET_TYPE_TEXT_MAP } from "@/app/lib/constants/asset-types";
import { IAsset } from "../types/assets";

interface IAssetListProps {
  assets: IAsset[];
}
 
export const AssetList: React.FC<IAssetListProps> = ({ assets }) => {
  const dates = getDateHeaders(assets);
  const groups = groupAssetsByType(assets);

  return (
    <Table className="table-fixed">
      <TableCaption className="caption-top">Ваши активы</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-[250px]" />
          {dates.map(date => <TableHead key={date} className="text-right w-[120px]">{date}</TableHead>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map(([type, assets]) => {
          return (
            <Fragment key={type}>
              <TableRow key={type}>
                <TableCell className="font-bold max-w-[250px]">{ASSET_TYPE_TEXT_MAP[type]}</TableCell>
                {dates.map(date => <TableCell className="w-[120px]" key={date} />)}
              </TableRow>

              {assets.map((asset, index) => {
                return (
                  <TableRow key={index}>
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
          <TableCell className="font-bold max-w-[250px]">Итого</TableCell>
          {dates.map(date => {
            return <TableCell key={date} className="font-bold text-right w-[120px]">{getTotalCostForDate(assets, date)}</TableCell>;
          })}
        </TableRow>
      </TableFooter>
    </Table>
  )
}
