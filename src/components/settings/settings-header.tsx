import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type SettingsHeaderProps = {
  onBack: () => void;
};

export function SettingsHeader({ onBack }: SettingsHeaderProps) {
  const { t } = useTranslation();
  const { palette } = useAppTheme();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={t('settings.back')}
        hitSlop={8}
      >
        <Ionicons name="chevron-back" size={24} color={palette.text} />
      </Pressable>
      <AppText variant="title">{t('settings.title')}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
});
