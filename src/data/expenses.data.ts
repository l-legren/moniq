/**
 * Data layer — expenses persistence via Supabase. Raw stored shapes only; no business rules.
 */

import { ApiError } from './api-error';
import { getCurrentUserId } from './auth.data';
import { supabase } from './supabase';

/** Persisted expense row (`public.expenses`). `spent_on` is `YYYY-MM-DD`; `spent_at` is a full ISO timestamp. */
export type ExpenseRow = {
  id: string;
  category: string;
  amount: number;
  spent_on: string;
  spent_at: string;
  /** Free-text label, only meaningful for the "other" category. */
  note: string | null;
};

const COLUMNS = 'id, category, amount, spent_on, spent_at, note';

export async function getExpenseRows(): Promise<ExpenseRow[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('expenses')
    .select(COLUMNS)
    .eq('user_id', userId)
    .order('spent_at', { ascending: false });
  if (error) throw new ApiError(error.message, error);
  return data;
}

export type NewExpenseRow = {
  category: string;
  amount: number;
  spent_on: string;
  spent_at: string;
  note?: string;
};

export async function insertExpenseRow(row: NewExpenseRow): Promise<ExpenseRow> {
  const { data, error } = await supabase
    .from('expenses')
    .insert({ ...row, note: row.note ?? null })
    .select(COLUMNS)
    .single();
  if (error) throw new ApiError(error.message, error);
  return data;
}

export async function deleteExpenseRow(id: string): Promise<void> {
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw new ApiError(error.message, error);
}
