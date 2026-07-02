import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { BalancePage } from '@/components/today/balance-page';
import { EntryArea } from '@/components/today/entry-area';
import { ResistedPager } from '@/components/today/resisted-pager';
import { ScrollHint } from '@/components/today/scroll-hint';
import { TodayHeader } from '@/components/today/today-header';
import { type CategoryId } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useAddExpense } from '@/hooks/use-expenses';
import { applyAmountKey, type AmountKey } from '@/services/amount-input';

export default function TodayScreen() {
  const [draftAmount, setDraftAmount] = useState('');
  const [category, setCategory] = useState<CategoryId | null>(null);
  const [adding, setAdding] = useState(false);
  const addExpense = useAddExpense();

  const hasAmount = parseFloat(draftAmount) > 0;

  const handleKey = (key: AmountKey) => setDraftAmount((current) => applyAmountKey(current, key));

  const toggleAdd = () => {
    if (hasAmount) setAdding((value) => !value);
  };

  const confirm = () => {
    if (!hasAmount || category === null) return;
    addExpense.mutate({ category, amount: parseFloat(draftAmount) });
    setDraftAmount('');
    setCategory(null);
    setAdding(false);
  };

  return (
    <Screen edges={['top']}>
      <ResistedPager
        enabled={!adding}
        hint={<ScrollHint />}
        front={
          <View style={styles.front}>
            <TodayHeader />
            <EntryArea
              draftAmount={draftAmount}
              hasAmount={hasAmount}
              adding={adding}
              category={category}
              onKeyPress={handleKey}
              onToggleAdd={toggleAdd}
              onBack={() => setAdding(false)}
              onSelectCategory={setCategory}
              onConfirm={confirm}
            />
          </View>
        }
        back={<BalancePage />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  front: {
    flex: 1,
    // Reserve room at the bottom for the "scroll for balance" hint.
    paddingBottom: Spacing.six,
  },
});
