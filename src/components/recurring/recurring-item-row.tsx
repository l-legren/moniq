import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { formatMonthYear } from '@/services/date';
import { fmtR } from '@/services/money';
import type { Frequency, RecurringItem } from '@/services/recurring.service';

/** Human subtitle for an item's frequency: "Monthly" / "Yearly" / "Until {month}". */
export function frequencyLabel(frequency: Frequency, t: TFunction): string {
  if (frequency.kind === 'term') {
    return t('recurring.until', { month: formatMonthYear(frequency.endDate) });
  }
  return frequency.cadence === 'yearly' ? t('recurring.yearly') : t('recurring.monthly');
}

export function RecurringItemRow({ item }: { item: RecurringItem }) {
  const { t } = useTranslation();
  const isIncome = item.type === 'income';
  const subtitle = frequencyLabel(item.frequency, t);
  const amount = `${isIncome ? '+' : '−'}${fmtR(item.amount)}`;

  return (
    <View
      accessible
      accessibilityLabel={t('recurring.itemRow', { name: item.name, subtitle, amount })}
      style={styles.row}
    >
      <View importantForAccessibility="no-hide-descendants">
        <AppText>{item.name}</AppText>
        <AppText variant="small" color="text3">
          {subtitle}
        </AppText>
      </View>
      <AppText variant="mono" color={isIncome ? 'good' : 'text'} importantForAccessibility="no">
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
    paddingVertical: Spacing.two,
  },
});
