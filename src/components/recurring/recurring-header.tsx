import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export function RecurringHeader({ onAdd }: { onAdd: () => void }) {
  const { t } = useTranslation();
  const { palette } = useAppTheme();

  return (
    <View style={styles.row}>
      <AppText variant="title">{t('recurring.title')}</AppText>
      <Pressable
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel={t('recurring.addItem')}
        style={({ pressed }) => [
          styles.addButton,
          {
            backgroundColor: palette.card,
            borderColor: palette.hairline,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Ionicons name="add" size={22} color={palette.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
