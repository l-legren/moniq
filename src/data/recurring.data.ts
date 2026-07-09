/**
 * Data layer — recurring items (income + fixed expenses) persistence. Raw stored shapes only.
 * Income and expenses live in one array, discriminated by `type`.
 */

import { getJSON, setJSON, STORAGE_KEYS } from './storage';

/**
 * Persisted recurring item. `amount` is in the cadence's own unit (what the user entered — monthly or
 * yearly); the monthly-equivalent used by the allowance is derived in the service, not stored. The
 * display subtitle ("Monthly" / "Yearly" / "Until {month}") is also derived so it stays translatable.
 * `frequency` mirrors the domain union but with loose string members; the mapper narrows/validates it.
 * `endDate` is `YYYY-MM`.
 */
export type RecurringFrequencyRow =
  { kind: 'perpetual'; cadence: string } | { kind: 'term'; cadence: string; endDate: string };

export type RecurringRow = {
  id: string;
  type: string;
  name: string;
  amount: number;
  frequency: RecurringFrequencyRow;
  /** Optional category id — the valid set depends on `type` (income vs expense), validated in the service. */
  category?: string;
};

export async function getRecurringRows(): Promise<RecurringRow[]> {
  return (await getJSON<RecurringRow[]>(STORAGE_KEYS.recurring)) ?? [];
}

export async function saveRecurringRows(rows: RecurringRow[]): Promise<void> {
  await setJSON(STORAGE_KEYS.recurring, rows);
}
