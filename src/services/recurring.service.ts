/**
 * Business layer — recurring items (income + fixed expenses). Domain model + mapper + rules.
 */

import {
  INCOME_CATEGORY_IDS,
  RECURRING_EXPENSE_CATEGORY_IDS,
  type RecurringCategoryId,
} from '@/constants/categories';
import { getRecurringRows, saveRecurringRows, type RecurringRow } from '@/data/recurring.data';

import { makeId } from '@/utils/id';

export type RecurringType = 'income' | 'expense';
export type Cadence = 'monthly' | 'yearly';

export type Frequency =
  { kind: 'perpetual'; cadence: Cadence } | { kind: 'term'; cadence: Cadence; endDate: string }; // endDate: YYYY-MM

export type RecurringItem = {
  id: string;
  type: RecurringType;
  name: string;
  /** As entered, in the cadence's unit. */
  amount: number;
  frequency: Frequency;
  /** Normalised to a monthly figure (yearly ÷ 12) — this is what the allowance uses. */
  monthlyAmount: number;
  /** Optional category — the valid id set depends on `type` (income vs expense). */
  category?: RecurringCategoryId;
};

function toType(value: string): RecurringType {
  return value === 'income' ? 'income' : 'expense';
}

function toCategory(
  type: RecurringType,
  value: string | undefined
): RecurringCategoryId | undefined {
  if (!value) return undefined;
  const ids: readonly string[] =
    type === 'income' ? INCOME_CATEGORY_IDS : RECURRING_EXPENSE_CATEGORY_IDS;
  return ids.includes(value) ? (value as RecurringCategoryId) : undefined;
}

function toCadence(value: string): Cadence {
  return value === 'yearly' ? 'yearly' : 'monthly';
}

export function monthlyAmountOf(amount: number, cadence: Cadence): number {
  return cadence === 'yearly' ? amount / 12 : amount;
}

export function mapRowToRecurring(row: RecurringRow): RecurringItem {
  const cadence = toCadence(row.frequency.cadence);
  const frequency: Frequency =
    row.frequency.kind === 'term'
      ? { kind: 'term', cadence, endDate: row.frequency.endDate }
      : { kind: 'perpetual', cadence };

  const type = toType(row.type);

  return {
    id: row.id,
    type,
    name: row.name,
    amount: row.amount,
    frequency,
    monthlyAmount: monthlyAmountOf(row.amount, cadence),
    category: toCategory(type, row.category),
  };
}

export async function getRecurring(): Promise<RecurringItem[]> {
  const rows = await getRecurringRows();
  return rows.map(mapRowToRecurring);
}

export type NewRecurring = {
  type: RecurringType;
  name: string;
  amount: number;
  frequency: Frequency;
  category?: RecurringCategoryId;
};

export async function addRecurring(input: NewRecurring): Promise<RecurringItem> {
  const row: RecurringRow = {
    id: makeId(),
    type: input.type,
    name: input.name.trim(),
    amount: input.amount,
    frequency: input.frequency,
    category: input.category,
  };
  const rows = await getRecurringRows();
  await saveRecurringRows([row, ...rows]);
  return mapRowToRecurring(row);
}

export async function deleteRecurring(id: string): Promise<void> {
  const rows = await getRecurringRows();
  await saveRecurringRows(rows.filter((row) => row.id !== id));
}

export function incomeTotal(items: RecurringItem[]): number {
  return items.filter((i) => i.type === 'income').reduce((total, i) => total + i.monthlyAmount, 0);
}

export function costsTotal(items: RecurringItem[]): number {
  return items.filter((i) => i.type === 'expense').reduce((total, i) => total + i.monthlyAmount, 0);
}
