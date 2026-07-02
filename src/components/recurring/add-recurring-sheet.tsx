import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';

import { MonthPicker } from '@/components/recurring/month-picker';
import { SavingsField } from '@/components/recurring/savings-field';
import { SheetHeader } from '@/components/recurring/sheet-header';
import { Button } from '@/components/ui/button';
import { PillToggle } from '@/components/ui/pill-toggle';
import { Sheet } from '@/components/ui/sheet';
import { TextField } from '@/components/ui/text-field';
import { AppText } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useAllowance } from '@/hooks/use-allowance';
import { useAddRecurring } from '@/hooks/use-recurring';
import { useSetSavingsGoal } from '@/hooks/use-savings-goal';
import { computeAllowance } from '@/services/allowance.service';
import {
  monthlyAmountOf,
  type Cadence,
  type Frequency,
  type RecurringType,
} from '@/services/recurring.service';
import { fmtR } from '@/services/money';

type FrequencyKind = Frequency['kind'];

function defaultLastPayment(): string {
  const now = new Date();
  return `${now.getFullYear() + 1}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

type FieldProps = {
  label: string;
  children: ReactNode;
};

function Field({ label, children }: FieldProps) {
  return (
    <View style={styles.field}>
      <AppText variant="sectionLabel" color="text3">
        {label}
      </AppText>
      {children}
    </View>
  );
}

type AddRecurringSheetProps = {
  visible: boolean;
  onClose: () => void;
};

export function AddRecurringSheet({ visible, onClose }: AddRecurringSheetProps) {
  const { t } = useTranslation();
  const { incomeTotal, costsTotal, savingsGoal } = useAllowance();
  const addRecurring = useAddRecurring();
  const setSavingsGoal = useSetSavingsGoal();

  const [type, setType] = useState<RecurringType>('expense');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [cadence, setCadence] = useState<Cadence>('monthly');
  const [frequencyKind, setFrequencyKind] = useState<FrequencyKind>('perpetual');
  const [lastPayment, setLastPayment] = useState(defaultLastPayment);
  const [savingsDraft, setSavingsDraft] = useState(savingsGoal);

  useEffect(() => {
    // Keep the slider in sync with the persisted goal (e.g. after it first loads, or an external change).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSavingsDraft(savingsGoal);
  }, [savingsGoal]);

  const amountValue = parseFloat(amount) || 0;
  const draftMonthly = monthlyAmountOf(amountValue, cadence);
  const previewAllowance = computeAllowance({
    incomeTotal: incomeTotal + (type === 'income' ? draftMonthly : 0),
    costsTotal: costsTotal + (type === 'expense' ? draftMonthly : 0),
    savingsGoal: savingsDraft,
  });
  const isIncome = type === 'income';
  const canConfirm = name.trim().length > 0 && amountValue > 0;

  const resetForm = () => {
    setType('expense');
    setName('');
    setAmount('');
    setCadence('monthly');
    setFrequencyKind('perpetual');
    setLastPayment(defaultLastPayment());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    const frequency: Frequency =
      frequencyKind === 'term'
        ? { kind: 'term', cadence, endDate: lastPayment }
        : { kind: 'perpetual', cadence };
    addRecurring.mutate({ type, name: name.trim(), amount: amountValue, frequency });
    resetForm();
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={handleClose}>
      <SheetHeader title={t('recurring.sheetTitle')} onClose={handleClose} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PillToggle
          options={[
            { value: 'expense', label: t('recurring.typeExpense') },
            { value: 'income', label: t('recurring.typeIncome') },
          ]}
          value={type}
          onChange={setType}
          tone={isIncome ? 'good' : 'accent'}
        />

        <TextField
          label={t('recurring.name')}
          value={name}
          onChangeText={setName}
          placeholder={t('recurring.namePlaceholder')}
          autoCapitalize="words"
        />

        <TextField
          label={t('recurring.amount')}
          value={amount}
          onChangeText={(text) => setAmount(text.replace(/[^0-9.]/g, ''))}
          placeholder="0"
          keyboardType="decimal-pad"
        />

        <Field label={t('recurring.cadence')}>
          <PillToggle
            options={[
              { value: 'monthly', label: t('recurring.monthly') },
              { value: 'yearly', label: t('recurring.yearly') },
            ]}
            value={cadence}
            onChange={setCadence}
            tone="neutral"
          />
        </Field>

        <Field label={t('recurring.frequency')}>
          <PillToggle
            options={[
              { value: 'perpetual', label: t('recurring.frequencyPerpetual') },
              { value: 'term', label: t('recurring.frequencyFixed') },
            ]}
            value={frequencyKind}
            onChange={setFrequencyKind}
            tone="neutral"
          />
        </Field>

        {frequencyKind === 'term' && (
          <Field label={t('recurring.lastPayment')}>
            <MonthPicker value={lastPayment} onChange={setLastPayment} />
          </Field>
        )}

        <SavingsField
          value={savingsDraft}
          onChange={setSavingsDraft}
          onCommit={(value) => setSavingsGoal.mutate(value)}
          previewLabel={fmtR(previewAllowance)}
        />

        <Button
          label={isIncome ? t('recurring.addIncome') : t('recurring.addExpense')}
          tone={isIncome ? 'good' : 'accent'}
          disabled={!canConfirm}
          onPress={handleConfirm}
        />
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  // flexShrink lets the form scroll within the sheet's max height instead of overflowing it.
  scroll: {
    flexShrink: 1,
  },
  content: {
    gap: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
  },
  field: {
    gap: Spacing.two,
  },
});
