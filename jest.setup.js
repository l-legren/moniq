// Functional in-memory mock for AsyncStorage so data-layer tests can run without a native module.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Deterministic ids in tests (avoids the native expo-crypto module).
jest.mock('expo-crypto', () => {
  let n = 0;
  return { randomUUID: () => `uuid-${(n += 1)}` };
});
