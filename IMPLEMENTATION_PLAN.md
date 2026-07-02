# Moniq — Implementation Plan & Progress

> Durable mirror of the finance-app build plan. Executed **one phase at a time**; user reviews each
> chunk before the next starts. Full plan lives at `~/.claude/plans/now-based-on-the-temporal-dawn.md`.

## Progress checklist
- [x] **Phase 0 — CLAUDE.md cleanup** (single-app layered architecture) — *in review*
- [ ] **Phase 1 — Foundation + theme + primitives**
- [ ] **Phase 2 — Data model** (data → services → hooks)
- [ ] **Phase 3 — Today**
- [ ] **Phase 4 — Recurring**
- [ ] **Phase 5 — Insights**
- [ ] **Phase 6 — Settings**

## Locked decisions
- **Layered single app** (no monorepo/CMS/`packages`): `src/app` (UI) → `src/hooks` (React Query) →
  `src/services` (business logic) → `src/data` (persistence).
- **State/persistence: React Query + AsyncStorage.** Screens never touch storage; only `src/data`
  changes if Supabase is ever added.
- **i18n (i18next) from the start** — every visible string + `accessibilityLabel` via `t()`.
- **Daily budget derived**: `dailyBudget = round((incomeTotal − costsTotal − savingsGoal)/30)` (prototype
  hardcoded €40; we link Today's budget to the live allowance).
- **Currency: EUR (€)**; `fmt` = 2 decimals, `fmtR` = rounded + thousands separator.
- **First-launch seed** of sample income/costs + `savingsGoal = 350`; expenses start empty.
- **Insights aggregate real logged expenses** by date; empty states when no history.

## Target structure
```
src/
  app/ _layout.tsx, (tabs)/{_layout,index=Today,recurring,insights}.tsx, settings.tsx (modal)
  data/ storage.ts, expenses.data.ts, recurring.data.ts, savings.data.ts, settings.data.ts, seed.ts
  services/ money.ts, expenses.service.ts, recurring.service.ts, allowance.service.ts, insights.service.ts
  hooks/ query-keys.ts, use-expenses, use-recurring, use-savings-goal, use-allowance, use-insights, use-theme
  components/ ui/ + today/ recurring/ insights/ settings/
  constants/ theme.ts (warm palette + type scale), categories.ts
  i18n/ index.ts, locales/en.json
```

## Phase details

### Phase 0 — CLAUDE.md cleanup ✅ (this chunk)
Rewrote CLAUDE.md for the single-app layered model; removed monorepo/CMS/`packages/*`/`@moniq/*`/
Supabase-first-arg leftovers. Kept Accessibility, React Compiler (single app), i18n; data layer now =
AsyncStorage, swappable to Supabase later.

### Phase 1 — Foundation + theme + primitives
- Add deps: `@tanstack/react-query`, `@react-native-async-storage/async-storage`, `i18next` +
  `react-i18next`, `@expo-google-fonts/plus-jakarta-sans` (300/400/500/600). Wire existing
  `react-native-gesture-handler` + `react-native-reanimated`.
- `src/app/_layout.tsx`: `GestureHandlerRootView` → `QueryClientProvider` → `ThemeProvider` →
  `SafeAreaProvider`; load fonts (`useFonts`) + init i18n (`import '@/i18n'`); keep splash gating.
- `src/constants/theme.ts` (rewrite): port both `THEMES` tables (dark bg `#14110C`… accent `#FF7A59`,
  accent2 `#5FA8E8`, good `#5FBF86`, bad `#F2637A`; light equivalents) + type scale (title 18/500,
  section label 11/500 uppercase 0.4px, body 13–14, hero 32–56/300 tabular-nums) + 4px radius tokens.
- `src/hooks/use-theme.ts`: `ThemeProvider` with `userTheme` persisted to AsyncStorage, defaulting to OS,
  overridable in Settings.
- `src/components/ui/`: `text.tsx` (type scale), `screen.tsx`, `hairline.tsx`, `stat-row.tsx`,
  `pill-toggle.tsx`, `sheet.tsx`, `switch.tsx`. **Reuse** `ui/collapsible.tsx`.

### Phase 2 — Data model
- `src/data/`: `storage.ts` (typed get/set + keys), resource modules, `seed.ts`. Raw shapes:
  `Expense {id, cat, amount, time, date}` (add `date`), `RecurringItem {id, name, sub, amount, type}`,
  `savingsGoal:number`, `theme`.
- `src/services/`: models + mappers (exported), `money.ts`, allowance/daily-budget/today-remaining/
  preview, insights aggregation (`saved`, `onTrack = saved ≥ goal*0.8`, bars, breakdown, static tips).
- `src/hooks/`: `query-keys.ts` first, then hooks with optimistic updates; `use-allowance` composes.

### Phase 3 — Today
Header (avatar→Settings, greeting), keypad entry (rules from `press()`), **inline expanding Add panel**
(bespoke #1, Reanimated over keypad), **resisted-scroll balance reveal** (bespoke #2: `Gesture.Pan`,
`rawFrac`, visual `rawFrac²`, snap past 0.35, `cubic-bezier(0.32,0.72,0,1)` ~420ms, hint fade
`1−rawFrac*2.5`).

### Phase 4 — Recurring
Derivation card (income→costs→goal→allowance ÷30), two reusable collapsible sections, **Add Recurring
bottom sheet** (`sheet.tsx`): type toggle, name/amount, Perpetual/Fixed-term (+Last payment picker),
live savings slider (0–1500/10) + live allowance preview, type-colored confirm.

### Phase 5 — Insights
Weekly/Monthly toggle, period navigator (dim at bounds), monthly weekly-savings bars / weekly daily-spend
bars, on-track status, category breakdown + 2 static tips; aggregate real expenses, empty states.

### Phase 6 — Settings
Full-screen modal route: profile (static), Appearance→Dark mode `switch.tsx` (persists theme),
Log out (neutral), Delete account (red stub).

## Verification (per phase where relevant)
`pnpm lint` + `tsc --noEmit`; unit-test pure services; `/run` app and drive each flow; accessibility pass
on Today before merge.

## Out of scope (MVP)
Supabase/backend, auth/multi-user, server AI tips, Delete-account confirmation flow, multi-currency.
