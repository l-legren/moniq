import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import {
  Radius,
  Spacing,
  type Palette,
  type PaletteColor,
  type ThemeName,
} from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type Variant = 'primary' | 'secondary' | 'destructive';
type Tone = Extract<PaletteColor, 'accent' | 'good' | 'bad'>;

type ButtonColors = {
  background: string;
  border: string;
  borderWidth: number;
  text: PaletteColor;
};

/** Soft outline shadow so the pill button lifts off the gradient bg. Component-local — not a shared design token. */
const ButtonShadow = {
  dark: {
    shadowColor: '#000000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  light: {
    shadowColor: '#5A1030',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
} as const satisfies Record<ThemeName, ViewStyle>;

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  /** Fill color for the primary variant (semantic). Defaults to accent. */
  tone?: Tone;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

function resolveColors(
  palette: Palette,
  variant: Variant,
  tone: Tone,
  disabled: boolean
): ButtonColors {
  if (disabled)
    return { background: palette.card, border: palette.hairline, borderWidth: 1, text: 'text3' };
  if (variant === 'primary')
    return { background: palette[tone], border: 'transparent', borderWidth: 0, text: 'onAccent' };
  if (variant === 'destructive')
    return { background: palette.card, border: palette.bad, borderWidth: 1.5, text: 'bad' };
  // Secondary uses `text3` instead of the near-invisible `hairline` so the outline still reads
  // against the gradient background, not just the flat card fill it was designed for.
  return { background: palette.card, border: palette.text3, borderWidth: 1.5, text: 'text' };
}

function pressedOpacity(disabled: boolean, pressed: boolean): number {
  if (disabled) return 0.5;
  if (pressed) return 0.85;
  return 1;
}

/**
 * Pill button (fully rounded ends) with a soft outline shadow. primary = tone fill;
 * secondary = card + outline; destructive = card + red outline + red text.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  tone = 'accent',
  disabled = false,
  accessibilityLabel,
  style,
}: ButtonProps) {
  const { palette, theme } = useAppTheme();
  const colors = resolveColors(palette, variant, tone, disabled);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.base,
        ButtonShadow[theme],
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: colors.borderWidth,
          opacity: pressedOpacity(disabled, pressed),
        },
        style,
      ]}
    >
      <AppText variant="bodyMedium" color={colors.text}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
});
