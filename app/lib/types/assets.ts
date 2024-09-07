export interface IAssetData {
  assets: IAsset[];
}

export interface IAsset {
  name: string;
  type: TAssetType;
  history: Array<{
    date: string;
    cost: number;
  }>
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
