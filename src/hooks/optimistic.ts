/**
 * Small helpers for the "optimistically prepend to a cached list, roll back on error" pattern shared
 * by the add-expense / add-recurring mutations. Keeps the mutation hooks flat and readable.
 */

import type { QueryClient, QueryKey } from '@tanstack/react-query';

export type ListSnapshot<T> = { previous?: T[] };

/** Cancel in-flight fetches, snapshot the list, and prepend `item`. Returns the snapshot for rollback. */
export async function prependOptimistic<T>(
  client: QueryClient,
  key: QueryKey,
  item: T
): Promise<ListSnapshot<T>> {
  await client.cancelQueries({ queryKey: key });
  const previous = client.getQueryData<T[]>(key);
  client.setQueryData<T[]>(key, (old = []) => [item, ...old]);
  return { previous };
}

/** Restore the pre-mutation list snapshot. */
export function rollbackList<T>(
  client: QueryClient,
  key: QueryKey,
  context: ListSnapshot<T> | undefined
): void {
  if (context?.previous) client.setQueryData<T[]>(key, context.previous);
}
