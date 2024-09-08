import { expect, it, describe, beforeEach, afterEach, vi } from 'vitest'
import { getAverageWeightedSum, getROIRate, getSortedHistory, getSumDelta, getTotalDays, getTotalSum } from '../roi-rate';
import { IAsset } from '../../types/assets';

const assets: IAsset[] = [
  {
    name: 'Test',
    type: 'bonds',
    history: [
      { date: '01.01.2024', reason: 'created', cost: 1000 },
      { date: '31.03.2024', reason: 'deposit', cost: 1500 },
      { date: '29.07.2024', reason: 'withdraw', cost: 1200 },
      { date: '31.12.2024', reason: 'changed', cost: 1300 }
    ],
  },
  {
    name: 'Test2',
    type: 'bonds',
    history: [
      { date: '04.04.2024', reason: 'created', cost: 1100 },
    ],
  },
  {
    name: 'Test3',
    type: 'bonds',
    history: [
      { date: '01.06.2024', reason: 'created', cost: 800 },
      { date: '01.07.2024', reason: 'deposit', cost: 1200 },
      { date: '01.10.2024', reason: 'changed', cost: 1300 },
    ],
  },
];

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2024, 11, 31))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('getROIRate', () => {
  it('calculates ROI rate', () => {
    const result = getROIRate(assets).toFixed(4);

    expect(result).toBe('0.0732');
  });
});

describe('getSumDelta', () => {
  it('calculates sum delta', () => {
    const result = getSumDelta(assets);

    expect(result).toBe(200);
  });
});

describe('getAverageWeightedSum', () => {
  it('calculates average weighted sum', () => {
    const result = getAverageWeightedSum(assets).toFixed(2);

    expect(result).toBe('2733.42');
  });
});

describe('getTotalDays', () => {
  it('calculates total days', () => {
    const result = getTotalDays(assets);

    expect(result).toBe(365);
  });
});

describe('getTotalSum', () => {
  it('returns total sum', () => {
    const result = getTotalSum(assets);

    expect(result).toBe(3700);
  });
});

describe('getSortedHistory', () => {
  it('returns sorted history', () => {
    const result = getSortedHistory(assets);

    expect(result).toEqual([
      expect.objectContaining({ date: '01.01.2024', reason: 'created', cost: 1000 }),
      expect.objectContaining({ date: '31.03.2024', reason: 'deposit', cost: 1500 }),
      expect.objectContaining({ date: '04.04.2024', reason: 'created', cost: 1100 }),
      expect.objectContaining({ date: '01.06.2024', reason: 'created', cost: 800 }),
      expect.objectContaining({ date: '01.07.2024', reason: 'deposit', cost: 1200 }),
      expect.objectContaining({ date: '29.07.2024', reason: 'withdraw', cost: 1200 }),
      expect.objectContaining({ date: '01.10.2024', reason: 'changed', cost: 1300 }),
      expect.objectContaining({ date: '31.12.2024', reason: 'changed', cost: 1300 }),
    ]);
  });
});
