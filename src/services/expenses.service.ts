/**
 * Business layer — expenses. Domain model + mapper + rules. Composes the data layer.
 */

import { CATEGORY_IDS, type CategoryId } from '@/constants/categories';
import { getExpenseRows, saveExpenseRows, type ExpenseRow } from '@/data/expenses.data';

import { todayISO, isoTime } from '@/utils/date';
import { makeId } from '@/utils/id';

export type Expense = {
  id: string;
  category: CategoryId;
  amount: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  /** Free-text label, only meaningful for the "other" category. */
  note?: string;
};

const DEFAULT_CATEGORY: CategoryId = 'other';

function toCategory(value: string): CategoryId {
  return (CATEGORY_IDS as readonly string[]).includes(value)
    ? (value as CategoryId)
    : DEFAULT_CATEGORY;
}

export function mapRowToExpense(row: ExpenseRow): Expense {
  return {
    id: row.id,
    category: toCategory(row.cat),
    amount: row.amount,
    date: row.date,
    time: row.time,
    note: row.note,
  };
}

export async function getExpenses(): Promise<Expense[]> {
  const rows = await getExpenseRows();
  return rows.map(mapRowToExpense);
}

export type NewExpense = { category: CategoryId; amount: number; note?: string };

export async function addExpense(input: NewExpense): Promise<Expense> {
  const now = new Date();
  const row: ExpenseRow = {
    id: makeId(),
    cat: input.category,
    amount: input.amount,
    date: todayISO(now),
    time: isoTime(now),
    note: input.note,
  };
  const rows = await getExpenseRows();
  await saveExpenseRows([row, ...rows]);
  return mapRowToExpense(row);
}

export async function deleteExpense(id: string): Promise<void> {
  const rows = await getExpenseRows();
  await saveExpenseRows(rows.filter((row) => row.id !== id));
}

/** Expenses logged on `day` (defaults to today). */
export function expensesOn(expenses: Expense[], day: string = todayISO()): Expense[] {
  return expenses.filter((e) => e.date === day);
}

export function sumAmount(expenses: Expense[]): number {
  return expenses.reduce((total, e) => total + e.amount, 0);
}
