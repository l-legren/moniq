import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { isoTime, todayISO } from '@/utils/date';
import {
  addExpense,
  getExpenses,
  type Expense,
  type NewExpense,
} from '@/services/expenses.service';

import { prependOptimistic, rollbackList } from './optimistic';
import { queryKeys } from './query-keys';

function buildOptimisticExpense(input: NewExpense): Expense {
  return {
    id: `optimistic-${Date.now()}`,
    category: input.category,
    amount: input.amount,
    date: todayISO(),
    time: isoTime(),
  };
}

export function useExpenses() {
  return useQuery({ queryKey: queryKeys.expenses(), queryFn: getExpenses });
}

export function useAddExpense() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: addExpense,
    onMutate: (input: NewExpense) =>
      prependOptimistic(client, queryKeys.expenses(), buildOptimisticExpense(input)),
    onError: (_error, _input, context) =>
      rollbackList<Expense>(client, queryKeys.expenses(), context),
    onSettled: () => client.invalidateQueries({ queryKey: queryKeys.expenses() }),
  });
}
