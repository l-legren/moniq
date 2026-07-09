import AsyncStorage from '@react-native-async-storage/async-storage';

import { getExpenseRows, saveExpenseRows, type ExpenseRow } from './expenses.data';

describe('expenses.data', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns an empty array when nothing is stored', async () => {
    expect(await getExpenseRows()).toEqual([]);
  });

  it('round-trips a row with a note', async () => {
    const row: ExpenseRow = {
      id: '1',
      cat: 'other',
      amount: 12.5,
      date: '2026-07-09',
      time: '14:30',
      note: 'Parking ticket',
    };

    await saveExpenseRows([row]);

    expect(await getExpenseRows()).toEqual([row]);
  });

  it('round-trips a row without a note', async () => {
    const row: ExpenseRow = {
      id: '2',
      cat: 'groceries',
      amount: 30,
      date: '2026-07-09',
      time: '09:00',
    };

    await saveExpenseRows([row]);

    expect(await getExpenseRows()).toEqual([row]);
  });
});
