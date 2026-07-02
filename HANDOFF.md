# Handoff: Minimalistic Finance App

## Overview
A mobile-first financial tracking app (iOS-style). Users log daily spending by category against a computed daily allowance, manage fixed monthly income/costs, and review spending analysis with a switchable weekly/monthly view. No bank integrations — everything is manual entry and local/on-device tracking for the MVP.

This package contains a high-fidelity HTML prototype (final colors, type, spacing, states, interactions). **Recreate the UI and behavior in your target stack** (React Native, SwiftUI, Flutter, web) using that platform's native patterns — don't try to embed the HTML.

## Fidelity
High-fidelity: pixel-accurate mockups, real interactions, real state transitions. Adapt to platform idiom but preserve the visual system and flows below.

## Files
- **Finance App.dc.html** — current interactive prototype. Open in a browser for the live reference (all tabs, both themes, every flow below).
- **README.md** — this spec.

---

## Design System

### Color Palette — semantic, not decorative
Three accent colors, each with a fixed meaning. Don't reassign them.

- **Accent (coral/orange)** — primary action / expenses. Dark `#FF7A59`, Light `#E85C3C`, tint `accentLight` for selected/hover states.
- **Good (green)** — income / positive status. Dark `#5FBF86`, Light `#3E9A64`, tint `goodLight`.
- **Accent2 (blue)** — savings target & daily allowance specifically (a third, distinct color so "money you can spend" reads differently from "expense" and "income"). Dark `#5FA8E8`, Light `#2E7BC4`.
- **Bad (rose/red)** — over-budget, destructive actions (Delete account). Dark `#F2637A`, Light `#D94F63`.
- **Neutral selection** — used for the Perpetual/Fixed-term frequency toggle (deliberately NOT colored — it's a neutral setting, not a semantic state). `neutralSel`: a ~8% neutral tint of the foreground color.

### Theme tables
**Dark**: bg `#14110C`, card `#1E1A14`, text `#F4EEE2`, text2 `#B5AFA0`, text3 `#7A726A`, hairline `rgba(245,235,220,0.10)`.
**Light**: bg `#F6F1E8`, card `#FFFFFF`, text `#2C2318`, text2 `#8B7F6D`, text3 `#A89D89`, hairline `rgba(60,45,20,0.10)`.

Theme is switched from Settings (see below) — not a floating toggle on-screen.

### Typography
Plus Jakarta Sans (300–600 weights), system-ui fallback. Deliberately flat hierarchy (zen/minimal direction):
- Page title: 18px / 500
- Section label: 11px / 500, uppercase, 0.4px tracking
- Body: 13–14px / 400–500
- Hero numbers: 32–56px / 300, tabular-nums, tight tracking

### Shape & spacing
Buttons/inputs/cards: 4px radius (flat, minimal — NOT the rounded-card look). Exception: bottom sheets/modals use large top radius (40px) for a smooth sheet silhouette. No drop shadows anywhere. Generous whitespace; 1px hairlines instead of card borders/shadows to separate content.

---

## Screens

### 1. Today (default tab)
**Header**: circular avatar (initial "M") + time-aware greeting ("Good morning/afternoon/evening, {userName}") with the date above it, top-left. **Tapping the avatar opens Settings** (see below).

**Entry area** (vertically centered, dominates the screen):
- "ADD EXPENSE" label + large amount display (types via keypad, no separate reveal step)
- Numeric keypad, always visible (1–9, ., 0, ⌫), 3-column grid
- **Add button**, directly below keypad with a 14px gap. Tapping it **expands upward, sliding over the keypad** (not a sheet, not a snackbar) to reveal:
  - Category list (Groceries, Drinks, Restaurants, Clothing, Transport, Other) with a checkmark on the selected one
  - **Back** + **Confirm** buttons side by side (Back collapses the panel without losing the typed amount; Confirm requires both an amount and a category)

**Balance reveal — resisted scroll**: below the entry area is a second "page" containing remaining balance + today's activity list. It's reached by a **deliberately resisted scroll gesture** (wheel or drag) — a quadratic-easing pager that requires sustained scroll effort past ~35% before it snaps open, mimicking iOS's elastic/rubber-band feel but as a discrete reveal rather than free scroll. A small chevron + "Scroll for balance" hint fades out as the user pulls. This is intentional friction: the primary action (logging a spend) stays uncluttered; checking the balance is a secondary, deliberate action.

### 2. Recurring
**Header**: title + a circular "+" button (top-right) that opens the add-item modal.

**Derivation card** (top): Income (green) → Fixed costs (rose) → Savings goal (blue) → Daily allowance (blue, large). This is the core formula: `(income − costs − savingsGoal) / 30`.

**Income / Fixed costs lists**: each section header is **collapsible** — click the label to toggle a chevron and collapse/expand that list independently.

**Add Recurring modal** (bottom sheet, opens from the "+"):
- Sheet spans from ~6% down to the bottom of the screen (tall — not a small drawer) with a 40px rounded top and generous internal padding (22px top / 24px sides / 36px bottom).
- **Expense / Income toggle** — Expense selected = coral; Income selected = green (matches the semantic palette above).
- **Name** + **Monthly amount** text inputs.
- **Frequency toggle: Perpetual / Fixed term** — applies to BOTH expense and income (e.g. a car loan is a fixed-term expense; a temporary side-gig is a fixed-term income). Selected state is neutral (not colored) since frequency is a structural setting, not a status. Choosing "Fixed term" reveals a **Last payment** month picker; the resulting item's subtitle reads "Until {Month Year}" instead of "Monthly".
- **Monthly savings target slider** (0–1500, step 10) — lives inside this same modal. Dragging it updates the app's actual savings goal **live**, and a "Daily allowance — with this change applied" preview recalculates in real time as you type the new item's amount too (so you see the effect of both the new item AND the target change before confirming).
- **Confirm button** colored by type (green for income, coral for expense); disabled (neutral, 50% opacity) until name + amount are valid.

### 3. Insights
**Period toggle**: **Weekly / Monthly** segmented control (accent2/blue when selected) — switches the entire tab's data scope.
**Period navigator**: ‹ label › — in Monthly mode steps through months ("April 2026" → "June 2026"); in Weekly mode steps through recent weeks ("2 weeks ago" → "This week"). Arrows dim (30% opacity) at the range boundary.

Content adapts to the period:
- **Monthly**: "Saved this month" vs. the monthly goal; chart = "Weekly savings" (bars per week within the month, green).
- **Weekly**: "Saved this week" vs. a pro-rated weekly goal; chart = "Daily spend" (7 daily bars, green under budget / rose over budget).
- Status line reads "On track with your goal" (green) or "Behind your goal" (rose) based on whether saved ≥ 80% of goal.

Below the chart (period-independent for MVP): category breakdown (bars) and AI-generated suggestion cards (2 short tips, static copy for now — see Open Questions).

### 4. Settings (opened from the Today avatar)
Full-screen overlay, not a tab. Contains:
- Back button + "Settings" title
- Profile row (avatar, name, email — static for MVP)
- **Appearance**: "Dark mode" row with a custom switch (replaces the old floating toggle entirely — this is now the only theme control)
- **Account**: "Log out" (neutral outline button), **"Delete account"** (red outline + red text — destructive, needs a confirmation step in production, not implemented in the prototype)

---

## State & Data Model

```
Expense       { id, category, amount, time }
RecurringItem { id, name, amount, sub }   // sub is either "Monthly" or "Until {Month Year}"
                                          // — derived from { frequency: 'perpetual'|'fixed', lastPayment } at creation time
SavingsGoal   number                      // monthly target, editable via the Recurring-modal slider
Theme         'dark' | 'light'
```

Derived values (recompute, don't store):
- `dailyRemaining = dailyBudget - sum(todaysExpenses)`
- `incomeTotal = sum(income.amount)`, `costsTotal = sum(costs.amount)`
- `dailyAllowance = (incomeTotal - costsTotal - savingsGoal) / 30`
- Insights weekly/monthly figures are period-scoped aggregates of the same expense/recurring data (the prototype mocks a few periods of sample data — real implementation should aggregate from actual logged expenses by date).

## Interaction Notes for Implementation

- **Keypad + expanding add panel**: on native, this is straightforward (an animated height/position change within a Stack/VStack). The HTML prototype had to work around a template-runtime quirk animating `max-height` on re-render — that workaround (mount/unmount instead of animating size) is irrelevant to your stack; a normal animated expand/collapse works fine natively.
- **Resisted scroll pager**: implement as a custom gesture recognizer — accumulate drag/scroll delta, apply a quadratic (or similar ease-in) curve so resistance increases as you approach the threshold, snap fully open/closed past ~35%, animate the snap with a decelerate curve (~400ms). This is bespoke; there's no off-the-shelf component for it on any platform.
- **Bottom sheets** (Recurring add modal): standard platform sheet/modal presentation is fine — match the tall height (~94% of screen) and 40px corner radius.
- Persist `expenses`, `recurringItems`, `savingsGoal`, and `theme` locally (UserDefaults/SharedPreferences/localStorage-equivalent) — no backend for MVP.

## Open Questions for the Dev Team
- **AI tips**: client-side heuristics for MVP, or server-generated later? Prototype copy is static placeholder text.
- **Insights data**: prototype uses a few hand-authored sample periods — real app needs to aggregate actual logged expenses by week/month.
- **Delete account**: needs a real confirmation flow (not stubbed in the prototype — it's a plain button).
- **Multi-user / auth**: out of scope for MVP per original spec — confirm still true.