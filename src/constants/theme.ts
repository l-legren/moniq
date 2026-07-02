/**
 * Design tokens for moniq.
 *
 * The finance UI uses the warm palette + type scale below (`Palettes`, `Typography`, `FontFamily`).
 * The legacy `Colors` / `Fonts` exports remain only for the Expo starter screens that are replaced in
 * a later phase — do not use them in new finance UI.
 */

import '@/global.css';

import { Platform, type TextStyle } from 'react-native';

/* ------------------------------------------------------------------ *
 * Finance design system — warm palette (ported from the prototype)
 * ------------------------------------------------------------------ */

export type ThemeName = 'dark' | 'light';

export const Palettes = {
  dark: {
    bg: '#14110C',
    card: '#1E1A14',
    text: '#F4EEE2',
    text2: '#B5AFA0',
    text3: '#7A726A',
    hairline: 'rgba(245,235,220,0.10)',
    accent: '#FF7A59',
    accentLight: 'rgba(255,122,89,0.14)',
    accent2: '#5FA8E8',
    accent2Light: 'rgba(95,168,232,0.14)',
    good: '#5FBF86',
    goodLight: 'rgba(95,191,134,0.14)',
    bad: '#F2637A',
    neutralSel: 'rgba(245,235,220,0.09)',
    scrim: 'rgba(8,6,4,0.5)',
    /** Text placed on top of an accent/good/bad fill (e.g. filled buttons). */
    onAccent: '#1A140A',
    /** Radial backdrop stops (near → far), for a LinearGradient. */
    backdrop: ['#2a2520', '#171410', '#100d0a'],
  },
  light: {
    bg: '#F6F1E8',
    card: '#FFFFFF',
    text: '#2C2318',
    text2: '#8B7F6D',
    text3: '#A89D89',
    hairline: 'rgba(60,45,20,0.10)',
    accent: '#E85C3C',
    accentLight: 'rgba(232,92,60,0.12)',
    accent2: '#2E7BC4',
    accent2Light: 'rgba(46,123,196,0.12)',
    good: '#3E9A64',
    goodLight: 'rgba(62,154,100,0.14)',
    bad: '#D94F63',
    neutralSel: 'rgba(60,45,20,0.07)',
    scrim: 'rgba(40,30,15,0.25)',
    onAccent: '#1A140A',
    backdrop: ['#F0E8D8', '#E7DCC8', '#DED2BB'],
  },
} as const;

export type Palette = (typeof Palettes)[ThemeName];
/** Keys that resolve to a single color string (used by `color` props on primitives). */
export type PaletteColor = {
  [K in keyof Palette]: Palette[K] extends string ? K : never;
}[keyof Palette];

/* ------------------------------------------------------------------ *
 * Typography — Plus Jakarta Sans, deliberately flat hierarchy.
 * Custom fonts must set an explicit fontFamily per weight (Android
 * ignores fontWeight for non-system fonts), so we key by weight name.
 * ------------------------------------------------------------------ */

export const FontFamily = {
  light: 'PlusJakartaSans_300Light',
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
} as const;

const tabular: TextStyle = { fontVariant: ['tabular-nums'] };

export const Typography = {
  /** Big hero amount (remaining balance, daily allowance). */
  heroXl: { fontFamily: FontFamily.light, fontSize: 56, lineHeight: 60, letterSpacing: -1, ...tabular },
  hero: { fontFamily: FontFamily.light, fontSize: 40, lineHeight: 46, letterSpacing: -0.5, ...tabular },
  /** Keypad amount display. */
  amount: { fontFamily: FontFamily.light, fontSize: 44, lineHeight: 50, letterSpacing: -0.5, ...tabular },
  /** Page / screen title. */
  title: { fontFamily: FontFamily.medium, fontSize: 18, lineHeight: 24 },
  /** Uppercase section label. */
  sectionLabel: {
    fontFamily: FontFamily.medium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  body: { fontFamily: FontFamily.regular, fontSize: 14, lineHeight: 20 },
  bodyMedium: { fontFamily: FontFamily.medium, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: FontFamily.regular, fontSize: 13, lineHeight: 18 },
  small: { fontFamily: FontFamily.regular, fontSize: 11, lineHeight: 14 },
  /** Numbers in lists / rows. */
  mono: { fontFamily: FontFamily.medium, fontSize: 14, lineHeight: 20, ...tabular },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof Typography;

/** Flat, minimal — 4px everywhere; sheets override with a large top radius. */
export const Radius = {
  base: 4,
  sheet: 40,
  pill: 999,
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/* ------------------------------------------------------------------ *
 * Legacy Expo-starter tokens (removed once starter screens are gone).
 * ------------------------------------------------------------------ */

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});
