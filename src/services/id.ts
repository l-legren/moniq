import * as Crypto from 'expo-crypto';

/** Standards-based UUID v4 for locally-created records (via expo-crypto — no polyfill needed). */
export function makeId(): string {
  return Crypto.randomUUID();
}
