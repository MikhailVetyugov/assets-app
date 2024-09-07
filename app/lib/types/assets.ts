export interface IAssetData {
  assets: IAsset[];
}

export interface IAsset {
  name: string;
  type: TAssetType;
  cost: number;
  date: string;
}

export type TAssetType =
  | 'share'
  | 'bonds'
  | 'realEstate'
  | 'cryptoCurrency'
  | 'gold'
  | 'business'
  | 'car'
  | 'other';
