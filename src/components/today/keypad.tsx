import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { AppText } from '@/components/ui/text';
import type { AmountKey } from '@/services/amount-input';

const KEYS: AmountKey[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

function KeypadKey({ value, onPress }: { value: AmountKey; onPress: (v: AmountKey) => void }) {
  const { t } = useTranslation();
  const label = value === 'del' ? t('today.deleteDigit') : value === '.' ? t('today.decimalPoint') : value;
  const display = value === 'del' ? '⌫' : value;

  return (
    <Pressable
      onPress={() => onPress(value)}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.key, pressed && styles.pressed]}>
      <AppText variant="hero" style={styles.glyph} importantForAccessibility="no" accessibilityElementsHidden>
        {display}
      </AppText>
    </Pressable>
  );
}

export function Keypad({
  onPress,
  onLayout,
}: {
  onPress: (v: AmountKey) => void;
  onLayout?: (e: LayoutChangeEvent) => void;
}) {
  return (
    <View style={styles.grid} onLayout={onLayout}>
      {KEYS.map((value) => (
        <KeypadKey key={value} value={value} onPress={onPress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  key: {
    width: '33.333%',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.5,
  },
  glyph: {
    fontSize: 26,
    lineHeight: 30,
  },
});
