import { supabase } from '@/data/supabase';

import { AuthServiceError, signIn } from './auth.service';

const mockSignInWithPassword = supabase.auth.signInWithPassword as jest.MockedFunction<
  typeof supabase.auth.signInWithPassword
>;

describe('signIn', () => {
  afterEach(() => {
    mockSignInWithPassword.mockReset();
  });

  it('rejects empty email or password without calling the backend', async () => {
    await expect(signIn('', 'password')).rejects.toMatchObject({ code: 'invalidInput' });
    await expect(signIn('user@example.com', '')).rejects.toMatchObject({ code: 'invalidInput' });
    expect(mockSignInWithPassword).not.toHaveBeenCalled();
  });

  it('maps a successful session to an AuthUser', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { session: { user: { id: 'user-1', email: 'user@example.com' } } },
      error: null,
    } as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>);

    await expect(signIn('user@example.com', 'password')).resolves.toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });
  });

  it('wraps a backend rejection as an invalidCredentials AuthServiceError', async () => {
    mockSignInWithPassword.mockResolvedValue({
      data: { session: null },
      error: new Error('Invalid login credentials'),
    } as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>);

    await expect(signIn('user@example.com', 'wrong')).rejects.toBeInstanceOf(AuthServiceError);
    await expect(signIn('user@example.com', 'wrong')).rejects.toMatchObject({
      code: 'invalidCredentials',
    });
  });
});
