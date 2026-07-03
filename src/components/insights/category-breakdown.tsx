import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { CATEGORY_LABEL_KEYS } from '@/constants/categories';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { CategoryTotal } from '@/services/insights.service';
import { fmtR } from '@/utils/money';
import { percentOf } from '@/utils/percent';

type BreakdownRowProps = {
  row: CategoryTotal;
  max: number;
};

function BreakdownRow({ row, max }: BreakdownRowProps) {
  const { t } = useTranslation();
  const { palette } = useAppTheme();
  const label = t(CATEGORY_LABEL_KEYS[row.category]);
  const amount = fmtR(row.amount);
  const width = percentOf(row.amount, max);

  return (
    <View accessible accessibilityLabel={`${label}: ${amount}`} style={styles.row}>
      <View style={styles.rowHeader} importantForAccessibility="no-hide-descendants">
        <AppText>{label}</AppText>
        <AppText variant="mono" color="text2">
          {amount}
        </AppText>
      </View>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={[styles.track, { backgroundColor: palette.hairline }]}
      >
        <View style={[styles.fill, { backgroundColor: palette.accent, width: `${width}%` }]} />
      </View>
    </View>
  );
}

type CategoryBreakdownProps = {
  breakdown: CategoryTotal[];
};

export function CategoryBreakdown({ breakdown }: CategoryBreakdownProps) {
  const { t } = useTranslation();
  const max = breakdown.length > 0 ? breakdown[0].amount : 0;

  return (
    <View style={styles.container}>
      <AppText variant="sectionLabel" color="text3">
        {t('insights.whereItGoes')}
      </AppText>
      {breakdown.length === 0 ? (
        <AppText variant="caption" color="text3">
          {t('insights.noData')}
        </AppText>
      ) : (
        <View style={styles.list}>
          {breakdown.map((row) => (
            <BreakdownRow key={row.category} row={row} max={max} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  list: {
    gap: Spacing.three,
  },
  row: {
    gap: Spacing.two,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  track: {
    height: 6,
    borderRadius: Radius.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
});
