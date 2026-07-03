import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { RecurringItemRow } from '@/components/recurring/recurring-item-row';
import { Collapse } from '@/components/ui/collapse';
import { Hairline } from '@/components/ui/hairline';
import { AppText } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { fmtR } from '@/utils/money';
import type { RecurringItem, RecurringType } from '@/services/recurring.service';

type SectionHeaderProps = {
  title: string;
  totalLabel: string;
  expanded: boolean;
  onToggle: () => void;
};

function SectionHeader({ title, totalLabel, expanded, onToggle }: SectionHeaderProps) {
  const { t } = useTranslation();
  const { palette } = useAppTheme();

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={t(expanded ? 'recurring.collapseSection' : 'recurring.expandSection', {
        section: title,
      })}
      style={styles.header}
    >
      <View style={styles.headerLeft}>
        <Ionicons
          name={expanded ? 'chevron-down' : 'chevron-forward'}
          size={16}
          color={palette.text3}
        />
        <AppText variant="sectionLabel" color="text3">
          {title}
        </AppText>
      </View>
      <AppText variant="mono" color="text2">
        {totalLabel}
      </AppText>
    </Pressable>
  );
}

function RecurringList({ items, emptyLabel }: { items: RecurringItem[]; emptyLabel: string }) {
  if (items.length === 0) {
    return (
      <AppText variant="caption" color="text3" style={styles.empty}>
        {emptyLabel}
      </AppText>
    );
  }

  return (
    <View style={styles.list}>
      {items.map((item, index) => (
        <View key={item.id}>
          {index > 0 && <Hairline style={styles.rowDivider} />}
          <RecurringItemRow item={item} />
        </View>
      ))}
    </View>
  );
}

type Props = {
  title: string;
  total: number;
  items: RecurringItem[];
  type: RecurringType;
  emptyLabel: string;
};

export function RecurringSection({ title, total, items, type, emptyLabel }: Props) {
  const [expanded, setExpanded] = useState(true);
  const totalLabel = `${type === 'income' ? '+' : '−'}${fmtR(total)}`;

  return (
    <View>
      <SectionHeader
        title={title}
        totalLabel={totalLabel}
        expanded={expanded}
        onToggle={() => setExpanded((value) => !value)}
      />
      <Collapse expanded={expanded}>
        <RecurringList items={items} emptyLabel={emptyLabel} />
      </Collapse>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  list: {
    paddingTop: Spacing.one,
  },
  rowDivider: {
    marginVertical: Spacing.half,
  },
  empty: {
    paddingVertical: Spacing.two,
  },
});
