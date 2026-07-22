import { ApiError } from './api-error';
import { supabase } from './supabase';
import { getSavingsGoalValue, saveSavingsGoalValue } from './savings.data';
import { mockQueryBuilder } from './test-support/supabase-query-builder';

jest.mock('./auth.data', () => ({ getCurrentUserId: jest.fn().mockResolvedValue('user-1') }));

const mockFrom = supabase.from as jest.MockedFunction<typeof supabase.from>;

describe('savings.data', () => {
  it('returns the stored goal value', async () => {
    mockFrom.mockReturnValue(
      mockQueryBuilder({ data: { savings_goal: 350 }, error: null }) as never
    );

    await expect(getSavingsGoalValue()).resolves.toBe(350);
  });

  it('throws an ApiError instead of silently returning null when the fetch fails', async () => {
    mockFrom.mockReturnValue(
      mockQueryBuilder({ data: null, error: { message: 'network error' } }) as never
    );

    await expect(getSavingsGoalValue()).rejects.toBeInstanceOf(ApiError);
  });

  it('throws an ApiError instead of silently succeeding when the update fails', async () => {
    mockFrom.mockReturnValue(
      mockQueryBuilder({ data: null, error: { message: 'network error' } }) as never
    );

    await expect(saveSavingsGoalValue(500)).rejects.toBeInstanceOf(ApiError);
  });
});
