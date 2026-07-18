# moniq

A daily-allowance budgeting app for iOS, Android, and web, built with Expo.

moniq turns your monthly income, fixed costs, and savings goal into a single number: **how much you can spend today**. Log expenses against that daily allowance, track recurring income and fixed costs, and review spending patterns over time — all with a fully accessible, offline-first mobile UI.

## Core concept

The daily allowance is the monthly surplus spread evenly across the month:

```
dailyAllowance = (monthlyIncome − fixedCosts − savingsGoal) / 30
```

Each day starts with that budget; logging an expense reduces what's left for today. The **Today** tab shows the live balance, **Recurring** manages the income/cost items that feed the formula, and **Insights** aggregates historical spending by week/month and category.

## Screens

| Screen                 | Purpose                                                                           |
| ---------------------- | --------------------------------------------------------------------------------- |
| `(tabs)/index` (Today) | Daily allowance, remaining balance, quick expense entry                           |
| `(tabs)/recurring`     | Recurring income and fixed-cost items (monthly/yearly, perpetual or term-limited) |
| `(tabs)/insights`      | Spending aggregated by period and category, charts                                |
| `add-expense`          | Log a new expense                                                                 |
| `breakdown`            | Category/period breakdown detail                                                  |
| `detail`               | Single expense/recurring item detail                                              |
| `settings`             | Savings goal, preferences                                                         |
| `login`                | Supabase email/password auth                                                      |

## Architecture

The app enforces a strict one-directional layering under `src/`, so each layer only knows about the one beneath it:

```
src/app/        screens (Expo Router)   → call hooks only
src/hooks/      React Query cache layer → import services only
src/services/   business logic          → import data only
src/data/       persistence             → AsyncStorage / Supabase only
```

- **`src/app/`** — file-based routes (Expo Router). Screens are presentation only; all state and logic is delegated to hooks.
- **`src/hooks/`** — TanStack React Query wrappers (`useQuery`/`useMutation`, optimistic updates). All cache keys are centralized in `src/hooks/query-keys.ts`.
- **`src/services/`** — pure business logic: the allowance formula, expense/recurring/savings domain models and mappers, insights aggregation, auth rules. No framework or storage dependencies — this is the most heavily unit-tested layer.
- **`src/data/`** — the only layer that touches persistence: local data (expenses, recurring items, savings goal, settings) via `AsyncStorage`, and remote auth/session via a shared Supabase client (`src/data/supabase.ts`). This is the intended swap point if a networked backend is extended in the future.

Supporting directories:

- `src/components/` — shared UI (`ui/` = design-system primitives) plus screen-specific components (`today/`, `insights/`, `recurring/`, `detail/`, `settings/`, `auth/`).
- `src/constants/` — theme tokens (colors, spacing) and category definitions.
- `src/i18n/` — i18next setup and locale strings (`locales/en.json`); all UI copy is externalized, no hardcoded strings.
- `src/utils/` — small framework-agnostic helpers (dates, ids).
- `src/types/` — shared TypeScript types.

## Tech stack

- **[Expo](https://expo.dev) / React Native 0.86** — cross-platform app shell (iOS, Android, web), with the **React Compiler** enabled for automatic memoization.
- **[Expo Router](https://docs.expo.dev/router/introduction/)** — file-based, typed navigation.
- **[TanStack React Query](https://tanstack.com/query)** — async state/cache management with optimistic updates.
- **[Supabase](https://supabase.com)** — authentication (email/password) and session management.
- **AsyncStorage** — on-device persistence for expenses, recurring items, savings goal, and settings.
- **[react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) / react-native-gesture-handler** — animations and gestures.
- **[react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts)** — insights charts.
- **[i18next](https://www.i18next.com/) / react-i18next** — internationalization.
- **[date-fns](https://date-fns.org/)** — date math for allowance and insights periods.
- **TypeScript** (strict mode) — throughout.
- **Jest / jest-expo** — unit testing, focused on the `services`/`data` layers.

## Accessibility

The app targets full screen-reader support (VoiceOver/TalkBack): every interactive element has an `accessibilityRole` and meaningful label, stateful controls expose `accessibilityState`, decorative elements are hidden from assistive tech, color contrast meets WCAG AA, and dynamic content (errors, live totals) is announced via live regions. See `CLAUDE.md` for the full ruleset.

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure Supabase — copy `.env.example` to `.env` and fill in your project's URL/anon key (either a local `supabase start` instance or a hosted project):

   ```bash
   cp .env.example .env
   ```

3. Start the app:

   ```bash
   pnpm start
   ```

   From there, open it in a [development build](https://docs.expo.dev/develop/development-builds/introduction/), Android emulator, iOS simulator, or [Expo Go](https://expo.dev/go). Or target a platform directly with `pnpm ios` / `pnpm android` / `pnpm web`.

## Scripts

| Command                        | Description                  |
| ------------------------------ | ---------------------------- |
| `pnpm start`                   | Start the Metro dev server   |
| `pnpm ios` / `android` / `web` | Start on a specific platform |
| `pnpm lint`                    | Lint with `expo lint`        |
| `pnpm format`                  | Format with Prettier         |
| `pnpm test`                    | Run the Jest test suite      |
| `pnpm test:watch`              | Run tests in watch mode      |

## Testing

Tests live next to the code they cover (`<name>.test.ts`) and target the `services`/`data` layers — pure business logic (allowance formula, mappers, aggregation) and persistence behavior. Run with `pnpm test`.

## Project conventions

Full contributor guidelines — layering rules, component conventions, i18n, accessibility, and testing philosophy — live in [`CLAUDE.md`](./CLAUDE.md) and [`AGENTS.md`](./AGENTS.md).
