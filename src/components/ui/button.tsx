import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Radius, Spacing, type Palette, type PaletteColor } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type Variant = 'primary' | 'secondary' | 'destructive';
type Tone = Extract<PaletteColor, 'accent' | 'good' | 'bad'>;

type ButtonColors = {
  background: string;
  border: string;
  text: PaletteColor;
};

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
  if (disabled) return { background: palette.card, border: palette.hairline, text: 'text3' };
  if (variant === 'primary')
    return { background: palette[tone], border: 'transparent', text: 'onAccent' };
  if (variant === 'destructive')
    return { background: palette.card, border: palette.bad, text: 'bad' };
  return { background: palette.card, border: palette.hairline, text: 'text' };
}

function pressedOpacity(disabled: boolean, pressed: boolean): number {
  if (disabled) return 0.5;
  if (pressed) return 0.85;
  return 1;
}

/**
 * Flat 4px-radius button. primary = tone fill; secondary = card + hairline outline;
 * destructive = card + red outline + red text.
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
  const { palette } = useAppTheme();
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
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
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
    borderRadius: Radius.base,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
});
