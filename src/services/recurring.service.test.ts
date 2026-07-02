import type { RecurringRow } from '@/data/recurring.data';

import { costsTotal, incomeTotal, mapRowToRecurring } from './recurring.service';

const row = (over: Partial<RecurringRow>): RecurringRow => ({
  id: '1',
  type: 'expense',
  name: 'Item',
  amount: 100,
  frequency: { kind: 'perpetual', cadence: 'monthly' },
  ...over,
});

describe('mapRowToRecurring', () => {
  it('narrows type and keeps a monthly amount as-is', () => {
    const item = mapRowToRecurring(row({ type: 'income', amount: 2400 }));
    expect(item.type).toBe('income');
    expect(item.monthlyAmount).toBe(2400);
    expect(item.frequency).toEqual({ kind: 'perpetual', cadence: 'monthly' });
  });

  it('normalises a yearly amount to monthly (÷ 12)', () => {
    const item = mapRowToRecurring(row({ amount: 1200, frequency: { kind: 'perpetual', cadence: 'yearly' } }));
    expect(item.monthlyAmount).toBe(100);
  });

  it('preserves a term end date', () => {
    const item = mapRowToRecurring(
      row({ frequency: { kind: 'term', cadence: 'monthly', endDate: '2027-06' } })
    );
    expect(item.frequency).toEqual({ kind: 'term', cadence: 'monthly', endDate: '2027-06' });
  });

  it('falls back to expense/monthly for unrecognised values', () => {
    const item = mapRowToRecurring(
      row({ type: 'weird', frequency: { kind: 'perpetual', cadence: 'weekly' } })
    );
    expect(item.type).toBe('expense');
    expect(item.frequency.cadence).toBe('monthly');
  });
});

describe('totals', () => {
  const items = [
    mapRowToRecurring(row({ id: 'a', type: 'income', amount: 2400 })),
    mapRowToRecurring(row({ id: 'b', type: 'income', amount: 1200, frequency: { kind: 'perpetual', cadence: 'yearly' } })),
    mapRowToRecurring(row({ id: 'c', type: 'expense', amount: 950 })),
  ];

  it('sums monthly-equivalents per type', () => {
    expect(incomeTotal(items)).toBe(2500); // 2400 + 1200/12
    expect(costsTotal(items)).toBe(950);
  });
});
