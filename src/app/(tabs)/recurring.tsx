import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet } from 'react-native';

import { AddRecurringSheet } from '@/components/recurring/add-recurring-sheet';
import { DerivationCard } from '@/components/recurring/derivation-card';
import { RecurringHeader } from '@/components/recurring/recurring-header';
import { RecurringSection } from '@/components/recurring/recurring-section';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useAllowance } from '@/hooks/use-allowance';
import { useRecurring } from '@/hooks/use-recurring';

export default function RecurringScreen() {
  const { t } = useTranslation();
  const { data: items = [] } = useRecurring();
  const { incomeTotal, costsTotal } = useAllowance();
  const [sheetOpen, setSheetOpen] = useState(false);

  const income = items.filter((item) => item.type === 'income');
  const costs = items.filter((item) => item.type === 'expense');

  return (
    <Screen edges={['top']}>
      <RecurringHeader onAdd={() => setSheetOpen(true)} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DerivationCard />
        <RecurringSection
          title={t('recurring.income')}
          total={incomeTotal}
          items={income}
          type="income"
          emptyLabel={t('recurring.emptyIncome')}
        />
        <RecurringSection
          title={t('recurring.fixedCosts')}
          total={costsTotal}
          items={costs}
          type="expense"
          emptyLabel={t('recurring.emptyCosts')}
        />
      </ScrollView>
      <AddRecurringSheet visible={sheetOpen} onClose={() => setSheetOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.five,
  },
});
