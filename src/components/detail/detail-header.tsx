import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type HeaderIconButtonProps = {
  icon: 'chevron-back' | 'add';
  onPress: () => void;
  accessibilityLabel: string;
};

function HeaderIconButton({ icon, onPress, accessibilityLabel }: HeaderIconButtonProps) {
  const { palette } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.iconButton,
        {
          backgroundColor: palette.card,
          borderColor: palette.hairline,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={20} color={icon === 'add' ? palette.accent : palette.text} />
    </Pressable>
  );
}

type DetailHeaderProps = {
  title: string;
  onBack: () => void;
  /** Only present for the income/costs sources — Detail's own add entry point. */
  onAdd?: () => void;
};

export function DetailHeader({ title, onBack, onAdd }: DetailHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <HeaderIconButton
        icon="chevron-back"
        onPress={onBack}
        accessibilityLabel={t('common.back')}
      />
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>
      {onAdd ? (
        <HeaderIconButton icon="add" onPress={onAdd} accessibilityLabel={t('recurring.addItem')} />
      ) : (
        <View
          style={styles.iconButton}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      )}
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
  title: {
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
