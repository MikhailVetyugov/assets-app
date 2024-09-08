import { expect, it, describe, beforeEach, afterEach, vi } from 'vitest'
import { getAverageWeightedSum, getROIRate, getSumDelta, getTotalDays } from '../roi-rate';
import { IAsset } from '../../types/assets';

const asset: IAsset = {
  name: 'Test',
  type: 'bonds',
  history: [
    { date: '01.01.2024', reason: 'created', cost: 1000 },
    { date: '31.03.2024', reason: 'deposit', cost: 1500 },
    { date: '29.07.2024', reason: 'withdrawn', cost: 1200 },
    { date: '31.12.2024', reason: 'changed', cost: 1300 }
  ],
};

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('getROIRate', () => {
  it('calculates ROI rate', () => {
    const result = getROIRate(asset).toFixed(4);

    expect(result).toBe('0.0810');
  });
});

describe('getSumDelta', () => {
  it('calculates sum delta', () => {
    const result = getSumDelta(asset);

    expect(result).toBe(100);
  });
});

describe('getAverageWeightedSum', () => {
  it('calculates average weighted sum', () => {
    const date = new Date(2024, 11, 31)
    vi.setSystemTime(date)

    const result = getAverageWeightedSum(asset).toFixed(2);

    expect(result).toBe('1249.32');
  });
});

describe('getTotalDays', () => {
  it('calculates total days', () => {
    const date = new Date(2024, 11, 31)
    vi.setSystemTime(date)

    const result = getTotalDays(asset);

    expect(result).toBe(365);
  });
});
