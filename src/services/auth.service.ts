/**
 * Business layer — auth. Domain model, mapper, and validation rules around Supabase sessions.
 */

import type { Session } from '@supabase/supabase-js';

import { onAuthStateChange, signInWithPassword, signOut } from '@/data/auth.data';

export type AuthUser = {
  id: string;
  email: string | null;
};

export type AuthErrorCode = 'invalidInput' | 'invalidCredentials' | 'unknown';

export class AuthServiceError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.code = code;
  }
}

export function mapSessionToUser(session: Session | null): AuthUser | null {
  if (!session) return null;
  return { id: session.user.id, email: session.user.email ?? null };
}

export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChange((session) => callback(mapSessionToUser(session)));
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  const trimmedEmail = email.trim();
  if (!trimmedEmail || !password) {
    throw new AuthServiceError('invalidInput');
  }

  let session: Session;
  try {
    session = await signInWithPassword(trimmedEmail, password);
  } catch {
    throw new AuthServiceError('invalidCredentials');
  }

  const user = mapSessionToUser(session);
  if (!user) throw new AuthServiceError('unknown');
  return user;
}

export async function signOutUser(): Promise<void> {
  await signOut();
}
