/**
 * Data layer — first-launch seed. Populates sample recurring items + a savings goal so the app is
 * immediately meaningful; expenses start empty. Guarded by a flag so it runs exactly once and never
 * overwrites the user's real data. Idempotent.
 */

import type { RecurringRow } from './recurring.data';
import { saveRecurringRows } from './recurring.data';
import { saveSavingsGoalValue } from './savings.data';
import { getJSON, setJSON, STORAGE_KEYS } from './storage';

const SEED_SAVINGS_GOAL = 350;

const SEED_RECURRING: RecurringRow[] = [
  { id: 'seed-salary', type: 'income', name: 'Salary', amount: 2400, frequency: { kind: 'perpetual', cadence: 'monthly' } },
  { id: 'seed-freelance', type: 'income', name: 'Freelance', amount: 350, frequency: { kind: 'perpetual', cadence: 'monthly' } },
  { id: 'seed-rent', type: 'expense', name: 'Rent', amount: 950, frequency: { kind: 'perpetual', cadence: 'monthly' } },
  { id: 'seed-health', type: 'expense', name: 'Health insurance', amount: 120, frequency: { kind: 'perpetual', cadence: 'monthly' } },
  { id: 'seed-transit', type: 'expense', name: 'Transit pass', amount: 59, frequency: { kind: 'perpetual', cadence: 'monthly' } },
  { id: 'seed-gym', type: 'expense', name: 'Gym', amount: 30, frequency: { kind: 'perpetual', cadence: 'monthly' } },
  { id: 'seed-phone', type: 'expense', name: 'Phone', amount: 29, frequency: { kind: 'perpetual', cadence: 'monthly' } },
  { id: 'seed-spotify', type: 'expense', name: 'Spotify', amount: 11, frequency: { kind: 'perpetual', cadence: 'monthly' } },
];

/** Seeds sample data once, on first launch. Safe to call before every read. */
export async function ensureSeeded(): Promise<void> {
  const seeded = await getJSON<boolean>(STORAGE_KEYS.seeded);
  if (seeded) return;

  await saveRecurringRows(SEED_RECURRING);
  await saveSavingsGoalValue(SEED_SAVINGS_GOAL);
  await setJSON(STORAGE_KEYS.seeded, true);
}
