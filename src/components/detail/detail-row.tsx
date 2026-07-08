import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Spacing, type PaletteColor } from '@/constants/theme';

export type DetailRowData = {
  id: string;
  primary: string;
  secondary?: string;
  amount: string;
  amountColor: PaletteColor;
  accessibilityLabel: string;
};

/**
 * Unified Detail-overlay row (14px primary / 11px secondary / 14px amount) used across every
 * source (income, costs, breakdown, activity) — distinct from each card's own smaller
 * 13px preview-row style.
 */
export function DetailRow({
  primary,
  secondary,
  amount,
  amountColor,
  accessibilityLabel,
}: DetailRowData) {
  return (
    <View accessible accessibilityLabel={accessibilityLabel} style={styles.row}>
      <View importantForAccessibility="no-hide-descendants">
        <AppText variant="bodyMedium">{primary}</AppText>
        {secondary ? (
          <AppText variant="small" color="text3">
            {secondary}
          </AppText>
        ) : null}
      </View>
      <AppText variant="mono" color={amountColor} importantForAccessibility="no">
        {amount}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.three,
  },
});
