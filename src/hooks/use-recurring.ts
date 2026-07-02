import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  addRecurring,
  getRecurring,
  monthlyAmountOf,
  type NewRecurring,
  type RecurringItem,
} from '@/services/recurring.service';

import { prependOptimistic, rollbackList } from './optimistic';
import { queryKeys } from './query-keys';

function buildOptimisticRecurring(input: NewRecurring): RecurringItem {
  return {
    id: `optimistic-${Date.now()}`,
    type: input.type,
    name: input.name.trim(),
    amount: input.amount,
    frequency: input.frequency,
    monthlyAmount: monthlyAmountOf(input.amount, input.frequency.cadence),
  };
}

export function useRecurring() {
  return useQuery({ queryKey: queryKeys.recurring(), queryFn: getRecurring });
}

export function useAddRecurring() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: addRecurring,
    onMutate: (input: NewRecurring) =>
      prependOptimistic(client, queryKeys.recurring(), buildOptimisticRecurring(input)),
    onError: (_error, _input, context) =>
      rollbackList<RecurringItem>(client, queryKeys.recurring(), context),
    onSettled: () => client.invalidateQueries({ queryKey: queryKeys.recurring() }),
  });
}
