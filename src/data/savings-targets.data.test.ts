import { ApiError } from './api-error';
import { supabase } from './supabase';
import {
  deleteSavingsTargetRow,
  getSavingsTargetRows,
  insertSavingsTargetRow,
} from './savings-targets.data';
import { mockQueryBuilder } from './test-support/supabase-query-builder';

jest.mock('./auth.data', () => ({ getCurrentUserId: jest.fn().mockResolvedValue('user-1') }));

const mockFrom = supabase.from as jest.MockedFunction<typeof supabase.from>;

describe('savings-targets.data', () => {
  it('throws an ApiError instead of silently returning an empty list when the fetch fails', async () => {
    mockFrom.mockReturnValue(
      mockQueryBuilder({ data: null, error: { message: 'network error' } }) as never
    );

    await expect(getSavingsTargetRows()).rejects.toBeInstanceOf(ApiError);
  });

  it('returns the inserted row on success', async () => {
    const row = {
      id: '1',
      name: 'Japan trip',
      category: 'travel',
      goal_amount: 3000,
      saved_amount: 0,
      target_date: '2027-03-01',
      priority: 'high',
      ai_verdict: 'Tight but doable.',
      status: 'active',
    };
    mockFrom.mockReturnValue(mockQueryBuilder({ data: row, error: null }) as never);

    await expect(
      insertSavingsTargetRow({
        name: 'Japan trip',
        category: 'travel',
        goal_amount: 3000,
        target_date: '2027-03-01',
        priority: 'high',
        ai_verdict: 'Tight but doable.',
      })
    ).resolves.toEqual(row);
  });

  it('throws an ApiError instead of silently succeeding when delete fails', async () => {
    mockFrom.mockReturnValue(
      mockQueryBuilder({ data: null, error: { message: 'not found' } }) as never
    );

    await expect(deleteSavingsTargetRow('missing-id')).rejects.toBeInstanceOf(ApiError);
  });
});
