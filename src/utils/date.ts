/**
 * Date helpers. All dates are local; ISO date strings are `YYYY-MM-DD` (lexicographically ordered),
 * which is our storage/compare boundary. date-fns handles the arithmetic in between.
 */

import { addDays, format, parseISO, startOfWeek } from 'date-fns';

const ISO_DATE = 'yyyy-MM-dd';

export function todayISO(d: Date = new Date()): string {
  return format(d, ISO_DATE);
}

export function isoTime(d: Date = new Date()): string {
  return format(d, 'HH:mm');
}

/** `YYYY-MM-DD` → `YYYY-MM`. */
export function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function addDaysISO(isoDate: string, days: number): string {
  return format(addDays(parseISO(isoDate), days), ISO_DATE);
}

/** ISO date of the Monday starting the week that contains `isoDate`. */
export function startOfWeekISO(isoDate: string): string {
  return format(startOfWeek(parseISO(isoDate), { weekStartsOn: 1 }), ISO_DATE);
}

/** `YYYY-MM` → e.g. `Jun 2027` (used for the "Until {month}" subtitle). */
export function formatMonthYear(ym: string): string {
  if (!/^\d{4}-\d{2}$/.test(ym)) return '';
  return format(parseISO(`${ym}-01`), 'MMM yyyy');
}
