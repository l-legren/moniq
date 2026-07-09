import AsyncStorage from '@react-native-async-storage/async-storage';

import { getRecurringRows, saveRecurringRows, type RecurringRow } from './recurring.data';

describe('recurring.data', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns an empty array when nothing is stored', async () => {
    expect(await getRecurringRows()).toEqual([]);
  });

  it('round-trips a row with a category', async () => {
    const row: RecurringRow = {
      id: '1',
      type: 'income',
      name: 'Day job',
      amount: 3000,
      frequency: { kind: 'perpetual', cadence: 'monthly' },
      category: 'salary',
    };

    await saveRecurringRows([row]);

    expect(await getRecurringRows()).toEqual([row]);
  });

  it('round-trips a row without a category', async () => {
    const row: RecurringRow = {
      id: '2',
      type: 'expense',
      name: 'Rent',
      amount: 1200,
      frequency: { kind: 'term', cadence: 'monthly', endDate: '2027-01' },
    };

    await saveRecurringRows([row]);

    expect(await getRecurringRows()).toEqual([row]);
  });
});
