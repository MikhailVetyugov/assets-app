import { expect, it } from 'vitest'
import { getDaysDiff } from '../dates';

it('calculates a difference in days between 2 dates', () => {
  expect(getDaysDiff('08.09.2024', '02.01.2025')).toBe(116)
});
