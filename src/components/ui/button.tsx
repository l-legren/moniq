import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Radius, Spacing, type PaletteColor } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type Variant = 'primary' | 'secondary';

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  /** Fill color for the primary variant (semantic). Defaults to accent. */
  tone?: Extract<PaletteColor, 'accent' | 'good' | 'bad'>;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Flat 4px-radius button. Primary = tone fill; secondary = card + hairline outline. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  tone = 'accent',
  disabled = false,
  accessibilityLabel,
  style,
}: Props) {
  const { palette } = useAppTheme();

  const isPrimary = variant === 'primary';
  const backgroundColor = disabled ? palette.card : isPrimary ? palette[tone] : palette.card;
  const borderColor = isPrimary ? 'transparent' : palette.hairline;
  const textColor = disabled ? 'text3' : isPrimary ? 'onAccent' : 'text';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor, borderColor, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}>
      <AppText variant="bodyMedium" color={textColor}>
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
