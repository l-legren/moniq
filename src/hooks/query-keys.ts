/**
 * Central React Query key factory. Every query/invalidation references these — never a raw string.
 */

export const queryKeys = {
  expenses: () => ['expenses'] as const,
  recurring: () => ['recurring'] as const,
  savingsGoal: () => ['savingsGoal'] as const,
};
