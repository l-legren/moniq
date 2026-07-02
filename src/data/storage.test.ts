import AsyncStorage from '@react-native-async-storage/async-storage';

import { getJSON, setJSON, STORAGE_KEYS } from './storage';

describe('storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('round-trips a JSON value', async () => {
    await setJSON(STORAGE_KEYS.savingsGoal, 350);
    expect(await getJSON<number>(STORAGE_KEYS.savingsGoal)).toBe(350);
  });

  it('returns null for a missing key', async () => {
    expect(await getJSON(STORAGE_KEYS.expenses)).toBeNull();
  });

  it('returns null (instead of throwing) when the stored value is not valid JSON', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.expenses, 'not-json{');
    expect(await getJSON(STORAGE_KEYS.expenses)).toBeNull();
  });
});
