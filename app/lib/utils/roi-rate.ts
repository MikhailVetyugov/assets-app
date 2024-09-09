import { IAsset } from "../types/assets";
import { fromLocaleFormat, getDaysDiff } from "./dates";

/*
 * This is not XIRR
 * About XIRR you can read:
 * - https://www.geeksforgeeks.org/extended-internal-rate-of-return-xirr-work-formula-how-to-calculate/
 * - https://github.com/Anexen/pyxirr/blob/main/src/lib.rs#L74
 * - https://github.com/peliot/XIRR-and-XNPV/blob/master/financial.py
 */
export function getROIRate(assets: IAsset[]) {
  if (!assets.length) {
    return 0;
  }

  const totalDays = getTotalDays(assets);

  if (totalDays === 0) {
    return 0;
  }

  const averageWeightedSum = getAverageWeightedSum(assets);

  if (averageWeightedSum === 0) {
    return 0;
  }

  return Math.pow((1 + getSumDelta(assets) / averageWeightedSum), 365 / totalDays) - 1;
}

export function getSumDelta(assets: IAsset[]) {
  const history = getSortedHistory(assets);
  const end = getTotalSum(assets);

  let deposits = 0;
  let withdraws = 0;

  history.forEach(item => {
    switch (item.reason) {
      case 'created': {
        deposits += item.cost;
        break;
      }
      case 'deposit': {
        const deposit = item.previous ? item.cost - item.previous.cost : item.cost;
        deposits += deposit;
        break;
      }
      case 'withdraw': {
        const withdraw = item.previous ? item.previous.cost - item.cost : item.cost;
        withdraws += withdraw;
        break;
      }
    }
  });

  return (end + withdraws) - deposits;
}

export function getAverageWeightedSum(assets: IAsset[]) {
  const currentDate = new Date().toLocaleDateString('ru');
  const history = getSortedHistory(assets);

  let currentSum = 0;
  let weightedSum = 0;

  history.forEach((item, index) => {
    const next = history.find((el, i) => i > index && ['deposit', 'withdraw', 'created'].includes(el.reason));
    const days = getDaysDiff(item.date, next ? next.date : currentDate);

    switch (item.reason) {
      case 'created': {
        currentSum += item.cost;
        weightedSum += days * currentSum;
        break;
      }
      case 'deposit': {
        const deposit = item.previous ? item.cost - item.previous.cost : item.cost;;
        currentSum += deposit;
        weightedSum += days * currentSum;
        break;
      }
      case 'withdraw': {
        const withdraw = item.previous ? item.previous.cost - item.cost : item.cost;
        currentSum -= withdraw;
        weightedSum += days * currentSum;
        break;
      }
    }
  });

  const totalDays = getTotalDays(assets)

  return weightedSum / totalDays;
}

export function getTotalDays(assets: IAsset[]) {
  const history = getSortedHistory(assets);

  const createdDate = history[0].date;
  const currentDate = new Date().toLocaleDateString('ru');

  return getDaysDiff(createdDate, currentDate)
}

export function getTotalSum(assets: IAsset[]) {
  return assets.reduce((acc, asset) => acc + (asset.history.at(-1)?.cost ?? 0), 0)
}

export function getSortedHistory(assets: IAsset[]) {
  return assets
    .flatMap(asset => asset.history.map((item, index) => {
        return {
          ...item,
          previous: asset.history[index - 1] ?? null,
        };
      })
    )
    .sort((first, second) => {
      const firstMs = fromLocaleFormat(first.date).getTime();
      const secondMs = fromLocaleFormat(second.date).getTime();

      return firstMs - secondMs;
    });
}

