import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AppText } from '@/components/ui/text';
import { CategoryPanel } from '@/components/today/category-panel';
import { Keypad } from '@/components/today/keypad';
import { type CategoryId } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { type AmountKey } from '@/services/amount-input';

const KEYPAD_GAP = 14;

type Props = {
  draftAmount: string;
  hasAmount: boolean;
  adding: boolean;
  category: CategoryId | null;
  onKeyPress: (v: AmountKey) => void;
  onToggleAdd: () => void;
  onBack: () => void;
  onSelectCategory: (id: CategoryId) => void;
  onConfirm: () => void;
};

export function EntryArea({
  draftAmount,
  hasAmount,
  adding,
  category,
  onKeyPress,
  onToggleAdd,
  onBack,
  onSelectCategory,
  onConfirm,
}: Props) {
  const { t } = useTranslation();

  const display = draftAmount ? `€${draftAmount}` : '—';

  return (
    <View style={styles.container}>
      <View style={styles.amountArea}>
        <AppText variant="sectionLabel" color="text3" style={styles.center}>
          {t('today.addExpense')}
        </AppText>
        <AppText
          variant="amount"
          color={hasAmount ? 'text' : 'text3'}
          style={styles.center}
          accessibilityLabel={t('today.amount', { amount: display })}>
          {display}
        </AppText>
      </View>

      <View style={styles.lowerArea}>
        <View style={styles.keypadBlock}>
          <Keypad onPress={onKeyPress} />
          <View style={{ height: KEYPAD_GAP }} />
          <Button label={t('today.add')} disabled={!hasAmount} onPress={onToggleAdd} />
        </View>

        {adding && (
          <CategoryPanel
            category={category}
            canConfirm={hasAmount && category !== null}
            onSelectCategory={onSelectCategory}
            onBack={onBack}
            onConfirm={onConfirm}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  amountArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
  },
  center: {
    textAlign: 'center',
  },
  lowerArea: {
    flex: 1.3,
    position: 'relative',
    justifyContent: 'center',
  },
  keypadBlock: {
    justifyContent: 'center',
  },
});
