import type { ExpenseRow } from '@/data/expenses.data';

import { mapRowToExpense } from './expenses.service';
import {
  categoryBreakdown,
  dailySpend,
  filterByRange,
  isOnTrack,
  savedInPeriod,
} from './insights.service';

const exp = (date: string, cat: string, amount: number) =>
  mapRowToExpense({ id: `${date}-${cat}`, cat, amount, date, time: '00:00' } as ExpenseRow);

// Week starting Monday 2026-06-29 … Sunday 2026-07-05.
const list = [
  exp('2026-06-29', 'groceries', 20),
  exp('2026-06-30', 'drinks', 5),
  exp('2026-07-01', 'groceries', 10),
  exp('2026-07-05', 'other', 7),
];

describe('filterByRange', () => {
  it('is start-inclusive and end-exclusive', () => {
    expect(filterByRange(list, '2026-06-29', '2026-07-01')).toHaveLength(2);
  });
});

describe('categoryBreakdown', () => {
  it('sums per category, sorts descending, omits zeros', () => {
    const breakdown = categoryBreakdown(list);
    expect(breakdown[0]).toEqual({ category: 'groceries', amount: 30 });
    expect(breakdown.map((r) => r.category)).toEqual(['groceries', 'other', 'drinks']);
    expect(breakdown.find((r) => r.category === 'clothing')).toBeUndefined();
  });
});

describe('dailySpend', () => {
  it('buckets Mon → Sun from the week start', () => {
    const week = dailySpend(list, '2026-06-29');
    expect(week[0]).toBe(20); // Mon
    expect(week[1]).toBe(5); // Tue
    expect(week[2]).toBe(10); // Wed
    expect(week[6]).toBe(7); // Sun
    expect(week.reduce((a, b) => a + b, 0)).toBe(42);
  });
});

describe('savedInPeriod / isOnTrack', () => {
  it('saved = budget*days - spent', () => {
    expect(savedInPeriod(40, 7, 245)).toBe(35);
  });

  it('on track at >= 80% of goal', () => {
    expect(isOnTrack(35, 40)).toBe(true); // 35 >= 32
    expect(isOnTrack(30, 40)).toBe(false); // 30 < 32
  });
});
