import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { AppText } from '@/components/ui/text';
import { Keypad } from '@/components/today/keypad';
import { Spacing } from '@/constants/theme';
import { type AmountKey } from '@/services/amount-input';

const KEYPAD_GAP = 14;

type EntryAreaProps = {
  draftAmount: string;
  hasAmount: boolean;
  onKeyPress: (v: AmountKey) => void;
  onAdd: () => void;
};

export function EntryArea({ draftAmount, hasAmount, onKeyPress, onAdd }: EntryAreaProps) {
  const { t } = useTranslation();

  const display = draftAmount ? `€${draftAmount}` : '—';

  return (
    <View style={styles.container}>
      <View style={styles.amountArea}>
        <AppText variant="sectionLabel" color="text3" style={styles.center}>
          {t('today.addExpense')}
        </AppText>
        <AppText
          variant="heroXl"
          color={hasAmount ? 'text' : 'text3'}
          style={styles.center}
          accessibilityLabel={t('today.amount', { amount: display })}
        >
          {display}
        </AppText>
      </View>

      <View style={styles.lowerArea}>
        <View style={styles.keypadBlock}>
          <Keypad onPress={onKeyPress} />
          <View style={{ height: KEYPAD_GAP }} />
          <Button label={t('today.add')} disabled={!hasAmount} onPress={onAdd} />
        </View>
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
    justifyContent: 'center',
  },
  keypadBlock: {
    justifyContent: 'center',
  },
});
