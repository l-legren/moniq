/**
 * Business layer — insights aggregation over logged expenses. Pure functions; the period navigation
 * (weekly/monthly stepping) is wired in the Insights screen phase using these primitives.
 */

import { CATEGORY_IDS, type CategoryId } from '@/constants/categories';

import { addDaysISO } from './date';
import { sumAmount, type Expense } from './expenses.service';

/** Expenses with `startISO <= date < endISO` (ISO dates compare lexicographically). */
export function filterByRange(expenses: Expense[], startISO: string, endISO: string): Expense[] {
  return expenses.filter((e) => e.date >= startISO && e.date < endISO);
}

export function totalSpent(expenses: Expense[]): number {
  return sumAmount(expenses);
}

export type CategoryTotal = { category: CategoryId; amount: number };

/** Per-category totals, highest first, omitting categories with no spend. */
export function categoryBreakdown(expenses: Expense[]): CategoryTotal[] {
  const totals = new Map<CategoryId, number>();
  for (const e of expenses) {
    totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  }
  return CATEGORY_IDS.map((category) => ({ category, amount: totals.get(category) ?? 0 }))
    .filter((row) => row.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

/** Spend for each of the 7 days from `weekStartISO` (Mon → Sun). */
export function dailySpend(expenses: Expense[], weekStartISO: string): number[] {
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDaysISO(weekStartISO, i);
    return sumAmount(expenses.filter((e) => e.date === day));
  });
}

/** How much of the budgeted allowance went unspent over the period (can be negative if over budget). */
export function savedInPeriod(dailyBudget: number, days: number, spent: number): number {
  return dailyBudget * days - spent;
}

/** On track once at least 80% of the goal is met (matches the prototype's threshold). */
export function isOnTrack(saved: number, goal: number): boolean {
  return saved >= goal * 0.8;
}
