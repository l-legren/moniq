/**
 * Data layer — recurring items (income + fixed expenses) persistence via Supabase.
 * Income and expenses live in one table, discriminated by `type`.
 */

import { ApiError } from './api-error';
import { getCurrentUserId } from './auth.data';
import { supabase } from './supabase';

/**
 * Persisted recurring row (`public.recurring`). `amount` is in the cadence's own unit (what the user
 * entered — monthly or yearly); the monthly-equivalent used by the allowance is derived in the
 * service, not stored. `end_date` (`YYYY-MM-DD`) is set only when `term_kind` is `'term'`.
 */
export type RecurringRow = {
  id: string;
  type: string;
  name: string;
  amount: number;
  cadence: string;
  term_kind: string;
  end_date: string | null;
  /** Optional category id — the valid set depends on `type` (income vs expense), validated in the service. */
  category: string | null;
};

const COLUMNS = 'id, type, name, amount, cadence, term_kind, end_date, category';

export async function getRecurringRows(): Promise<RecurringRow[]> {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('recurring')
    .select(COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new ApiError(error.message, error);
  return data;
}

export type NewRecurringRow = {
  type: string;
  name: string;
  amount: number;
  cadence: string;
  term_kind: string;
  end_date: string | null;
  category?: string;
};

export async function insertRecurringRow(row: NewRecurringRow): Promise<RecurringRow> {
  const { data, error } = await supabase
    .from('recurring')
    .insert({ ...row, category: row.category ?? null })
    .select(COLUMNS)
    .single();
  if (error) throw new ApiError(error.message, error);
  return data;
}

export async function deleteRecurringRow(id: string): Promise<void> {
  const { error } = await supabase.from('recurring').delete().eq('id', id);
  if (error) throw new ApiError(error.message, error);
}
