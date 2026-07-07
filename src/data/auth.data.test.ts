import { supabase } from './supabase';
import { signInWithPassword, signOut } from './auth.data';

const mockSignInWithPassword = supabase.auth.signInWithPassword as jest.MockedFunction<
  typeof supabase.auth.signInWithPassword
>;
const mockSignOut = supabase.auth.signOut as jest.MockedFunction<typeof supabase.auth.signOut>;

describe('signInWithPassword', () => {
  it('throws the underlying error instead of returning a null session', async () => {
    const authError = new Error('Invalid login credentials');
    mockSignInWithPassword.mockResolvedValue({
      data: { session: null },
      error: authError,
    } as Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>);

    await expect(signInWithPassword('user@example.com', 'wrong')).rejects.toBe(authError);
  });
});

describe('signOut', () => {
  it('throws when supabase reports an error', async () => {
    const authError = new Error('Network request failed');
    mockSignOut.mockResolvedValue({ error: authError } as Awaited<
      ReturnType<typeof supabase.auth.signOut>
    >);

    await expect(signOut()).rejects.toBe(authError);
  });
});
