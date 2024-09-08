import { IAsset } from "../types/assets";
import { getDaysDiff } from "./dates";
import { getLastAssetCost } from "./forms";

export function getROIRate(asset: IAsset) {
  return Math.pow((1 + getSumDelta(asset) / getAverageWeightedSum(asset)), 365 / getTotalDays(asset))  - 1;
}

export function getSumDelta(asset: IAsset) {
  let initial = 0;
  let deposits = 0;
  let withdraws = 0;

  asset.history.forEach((item, index) => {
    const previousItem = asset.history[index - 1];

    switch (item.reason) {
      case 'created': {
        initial = item.cost;
        break;
      }
      case 'deposit': {
        const deposit = item.cost - previousItem.cost;
        deposits += deposit;
        break;
      }
      case 'withdrawn': {
        const withdraw = previousItem.cost - item.cost;
        withdraws += withdraw;
        break;
      }
    }
  });

  return (getLastAssetCost(asset) + withdraws) - (initial + deposits);
}

export function getAverageWeightedSum(asset: IAsset) {
  const currentDate = new Date().toLocaleDateString('ru');

  let currentSum = 0;
  let weightedSum = 0;

  asset.history.forEach((item, index) => {
    const previousItem = asset.history[index - 1];
    const nextItem = asset.history[index + 1];

    const days = getDaysDiff(item.date, nextItem ? nextItem.date : currentDate);

    switch (item.reason) {
      case 'created': {
        currentSum += item.cost;
        weightedSum += days * currentSum;
        break;
      }
      case 'deposit': {
        const deposit = item.cost - previousItem.cost;
        currentSum += deposit;
        weightedSum += days * currentSum;
        break;
      }
      case 'withdrawn': {
        const withdraw = previousItem.cost - item.cost;
        currentSum -= withdraw;
        weightedSum += days * currentSum;
        break;
      }
    }
  });

  const totalDays = getTotalDays(asset)

  return weightedSum / totalDays;
}

export function getTotalDays(asset: IAsset) {
  // TODO: After migrating to a real DB throw an error if we can't find an item
  const createdDate = asset.history.find(item => item.reason === 'created')!.date;
  const currentDate = new Date().toLocaleDateString('ru');

  return getDaysDiff(createdDate, currentDate)
}
