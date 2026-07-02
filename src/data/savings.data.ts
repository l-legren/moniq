/**
 * Data layer — monthly savings goal persistence.
 */

import { getJSON, setJSON, STORAGE_KEYS } from './storage';

export async function getSavingsGoalValue(): Promise<number | null> {
  return getJSON<number>(STORAGE_KEYS.savingsGoal);
}

export async function saveSavingsGoalValue(value: number): Promise<void> {
  await setJSON(STORAGE_KEYS.savingsGoal, value);
}
