/**
 * Data layer — expenses persistence. Raw stored shapes only; no business rules.
 */

import { getJSON, setJSON, STORAGE_KEYS } from './storage';

/** Persisted expense shape. `date` is `YYYY-MM-DD`, `time` is `HH:MM` (local). */
export type ExpenseRow = {
  id: string;
  cat: string;
  amount: number;
  date: string;
  time: string;
  /** Free-text label, only meaningful for the "other" category. */
  note?: string;
};

export async function getExpenseRows(): Promise<ExpenseRow[]> {
  return (await getJSON<ExpenseRow[]>(STORAGE_KEYS.expenses)) ?? [];
}

export async function saveExpenseRows(rows: ExpenseRow[]): Promise<void> {
  await setJSON(STORAGE_KEYS.expenses, rows);
}
