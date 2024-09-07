import { TAssetType } from "../types/assets";

export const ASSET_TYPES: Array<{ value: TAssetType, name: string }> = [
  { value: 'share', name:'Акции' },
  { value: 'bonds', name:'Облигации' },
  { value: 'realEstate', name:'Недвижимость' },
  { value: 'cryptoCurrency', name:'Криптовалюта' },
  { value: 'gold', name:'Золото' },
  { value: 'business', name:'Бизнес' },
  { value: 'car', name:'Авто' },
  { value: 'other', name:'Другое' },
];

export const ASSET_TYPE_VALUES = ASSET_TYPES.map(item => item.value);

export const ASSET_TYPE_TEXT_MAP = ASSET_TYPES.reduce((acc, assetType) => {
  return {
    ...acc,
    [assetType.value]: assetType.name,
  };
}, {} as Record<TAssetType, string>);
