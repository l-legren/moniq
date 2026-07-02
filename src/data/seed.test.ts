import AsyncStorage from '@react-native-async-storage/async-storage';

import { getRecurringRows } from './recurring.data';
import { getSavingsGoalValue, saveSavingsGoalValue } from './savings.data';
import { ensureSeeded } from './seed';

describe('ensureSeeded', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('seeds recurring items and the savings goal on first run', async () => {
    await ensureSeeded();
    expect((await getRecurringRows()).length).toBeGreaterThan(0);
    expect(await getSavingsGoalValue()).toBe(350);
  });

  it('does not overwrite existing data on subsequent runs', async () => {
    await ensureSeeded();
    await saveSavingsGoalValue(500); // user edits their goal
    await ensureSeeded();
    expect(await getSavingsGoalValue()).toBe(500);
  });
});
