@AGENTS.md

# Accessibility

All interactive and informational UI in the app must be accessible to screen readers (VoiceOver on iOS, TalkBack on Android).

## Rules

- Every `Pressable` must have `accessibilityRole` (`"button"` or `"link"`) and a meaningful `accessibilityLabel` that describes the action, not just the visual content.
- Stateful controls (toggles, checkboxes, segmented filters) must use `accessibilityState` — e.g. `{{ selected: true }}`.
- Decorative views (glow bars, dividers, corner marks, icon arrows) must be hidden from AT with both:
  - `importantForAccessibility="no-hide-descendants"` (Android)
  - `accessibilityElementsHidden={true}` (iOS)
  - Use `"no"` instead of `"no-hide-descendants"` for leaf nodes with no children.
- Avoid Unicode symbols (▲ ▶ ◀ ● ○) as the sole content of an element — screen readers read them as their Unicode name. Hide the Text with `importantForAccessibility="no"` / `accessibilityElementsHidden` and put the label on the parent container.
- Stat/data boxes should use `accessible={true}` + `accessibilityLabel` on the container (e.g. `"Daily allowance: €40"`) and hide child Text nodes individually so VoiceOver reads the group as one unit.
- Images that convey meaning need `accessibilityLabel`; purely decorative images use `accessibilityElementsHidden={true}`.
- Custom gesture interactions that aren't screen-reader friendly (e.g. the resisted-scroll balance reveal) must provide an AT-only fallback action.

# Repository structure

Single Expo React Native app (Expo Router), organised into strict layers under `src/`:

```
src/
  app/        → Expo Router screens (UI layer)
  hooks/      → React Query cache/state layer
  services/   → business logic + domain models
  data/       → data layer (on-device persistence via AsyncStorage)
  components/  → shared + screen-specific UI (components/ui = design primitives)
  constants/   → theme tokens, categories
  i18n/        → i18next setup + locale files
assets/       → fonts, images, icons
```

# React Compiler

The **React Compiler is enabled** and stable (`babel-plugin-react-compiler@1.x`), via `"reactCompiler": true` in `app.json`.

The compiler auto-memoizes components, values, and functions. **Do not hand-write memoization:**
- No `useMemo`, no `useCallback`, no `React.memo` / `memo()` for performance.
- Write plain functions and object literals in component bodies; the compiler keeps their references stable (so context values and props passed down stay stable without manual wrapping).
- Only reach for `useMemo` if a value is expensive to compute *and* the compiler provably can't memoize it (rare) — and leave a comment saying why.
- `useRef`, `useState`, `useEffect` are unaffected — keep using them normally.

# Data architecture

The codebase uses a strict layer separation. Never collapse layers or skip one.

```
src/app/        → screens          (call hooks only)
src/hooks/      → React Query       (import services only)
src/services/   → business logic    (import data only)
src/data/       → persistence       (AsyncStorage only)
```

Data flows **app → hooks → services → data**; imports only ever point one level down.

## `src/data/` — data layer

- Only talks to on-device storage (AsyncStorage). Returns raw persisted row/value shapes.
- Never imports from `services/` or `hooks/`.
- File naming: `<resource>.data.ts` (e.g. `savings.data.ts`).
- Raw stored types (`ExpenseRow`, `RecurringItemRow`, …) are defined and exported from here.
- **Swap point for a future backend:** if Supabase (or any API) is ever added, only this layer changes — services and screens stay untouched.

## `src/services/` — business layer

- Owns domain models (camelCase, e.g. `Expense`, `Income`, `Cost`), mappers, merges, and business rules (allowance/daily-budget formulas, insights aggregation, money formatting).
- Composes multiple `data/` calls and applies rules.
- Never imports from `hooks/`.
- File naming: `<resource>.service.ts`.
- Mappers (e.g. `mapRowToExpense`) live here and are exported for unit testing.

## `src/hooks/` — React Query layer

- Imports only from `services/`. Never imports from `data/` directly.
- Owns React Query `useQuery` / `useMutation` wrappers and optimistic updates.
- All React Query cache keys must come from `src/hooks/query-keys.ts` — no hardcoded string arrays.

## Adding a new query

1. Add the key to `src/hooks/query-keys.ts` first.
2. Add the data function to `src/data/<resource>.data.ts`.
3. Add the service function to `src/services/<resource>.service.ts`.
4. Add the hook in `src/hooks/`.

## Query keys

`queryKeys` is a typed factory object at `src/hooks/query-keys.ts`.

- When adding a new query, add its key here first.
- Cross-hook invalidations must reference `queryKeys` — never a raw string.

# Internationalisation

Every string displayed in the app UI must come from i18next — no hardcoded string literals in JSX or `accessibilityLabel` props.

## Rules

- Use `const { t } = useTranslation()` and call `t('namespace.key')` for every visible string, including accessibility labels and descriptions.
- Add new keys to `src/i18n/locales/en.json` first. If other locale files exist for the same namespace, add the key there too.
- Locale files live in `src/i18n/locales/<locale>.json`. English (`en.json`) is the source of truth — keep its keys the master list.
- Hardcoded data that is not copy (merchant names, transaction descriptions, category ids, dates, account nicknames, addresses, URLs) does not need to go through i18next. Category **ids** stay in code; their display labels are i18n strings.
- Interpolated values use the `{{variable}}` syntax in the JSON value, e.g. `"memberSince": "Member since {{year}}"`.
- Never call `t()` outside a React component or hook — i18next must be initialised first (done via `import '@/i18n'` in `_layout.tsx`).
