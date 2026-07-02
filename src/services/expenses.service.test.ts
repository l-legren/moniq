import type { ExpenseRow } from '@/data/expenses.data';

import { expensesOn, mapRowToExpense, sumAmount } from './expenses.service';

const row = (over: Partial<ExpenseRow>): ExpenseRow => ({
  id: '1',
  cat: 'groceries',
  amount: 10,
  date: '2026-07-02',
  time: '12:00',
  ...over,
});

describe('mapRowToExpense', () => {
  it('maps a known category', () => {
    expect(mapRowToExpense(row({ cat: 'drinks' })).category).toBe('drinks');
  });

  it('falls back to "other" for an unknown category', () => {
    expect(mapRowToExpense(row({ cat: 'bogus' })).category).toBe('other');
  });
});

describe('expensesOn / sumAmount', () => {
  const list = [
    mapRowToExpense(row({ id: '1', cat: 'drinks', amount: 3.8, date: '2026-07-02' })),
    mapRowToExpense(row({ id: '2', cat: 'groceries', amount: 12.4, date: '2026-07-02' })),
    mapRowToExpense(row({ id: '3', cat: 'other', amount: 5, date: '2026-07-01' })),
  ];

  it('filters to a single day', () => {
    expect(expensesOn(list, '2026-07-02')).toHaveLength(2);
    expect(expensesOn(list, '2026-07-01')).toHaveLength(1);
  });

  it('sums amounts', () => {
    expect(sumAmount(list)).toBeCloseTo(21.2);
  });
});
