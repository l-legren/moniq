import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { AppText } from '@/components/ui/text';
import { CATEGORY_IDS, CATEGORY_LABEL_KEYS, type CategoryId } from '@/constants/categories';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type CategoryRowProps = {
  id: CategoryId;
  selected: boolean;
  onSelect: (id: CategoryId) => void;
};

function CategoryRow({ id, selected, onSelect }: CategoryRowProps) {
  const { t } = useTranslation();
  const { palette } = useAppTheme();
  const label = t(CATEGORY_LABEL_KEYS[id]);

  return (
    <Pressable
      onPress={() => onSelect(id)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={t('today.selectCategory', { category: label })}
      style={[
        styles.categoryRow,
        {
          borderColor: selected ? palette.accent : palette.hairline,
          backgroundColor: selected ? palette.accentLight : palette.card,
        },
      ]}>
      <AppText color={selected ? 'accent' : 'text'}>{label}</AppText>
      {selected && (
        <AppText color="accent" importantForAccessibility="no" accessibilityElementsHidden>
          ✓
        </AppText>
      )}
    </Pressable>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  const { palette } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('common.back')}
      style={({ pressed }) => [
        styles.backButton,
        { backgroundColor: palette.card, borderColor: palette.hairline, opacity: pressed ? 0.85 : 1 },
      ]}>
      <Ionicons name="chevron-back" size={22} color={palette.text} />
    </Pressable>
  );
}

type Props = {
  category: CategoryId | null;
  canConfirm: boolean;
  onSelectCategory: (id: CategoryId) => void;
  onBack: () => void;
  onConfirm: () => void;
};

/** Inline panel that expands over the keypad: scroll to pick a category, then Back / Confirm. */
export function CategoryPanel({ category, canConfirm, onSelectCategory, onBack, onConfirm }: Props) {
  const { t } = useTranslation();
  const { palette } = useAppTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      exiting={FadeOut.duration(120)}
      style={[styles.overlay, { backgroundColor: palette.bg }]}>
      <AppText variant="sectionLabel" color="text3">
        {t('today.category')}
      </AppText>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        {CATEGORY_IDS.map((id) => (
          <CategoryRow key={id} id={id} selected={id === category} onSelect={onSelectCategory} />
        ))}
      </ScrollView>

      <View style={styles.actions}>
        <BackButton onPress={onBack} />
        <Button
          label={t('common.confirm')}
          disabled={!canConfirm}
          onPress={onConfirm}
          style={styles.confirm}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    gap: Spacing.two,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.base,
    borderWidth: StyleSheet.hairlineWidth,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  backButton: {
    width: 52,
    height: 52,
    borderRadius: Radius.base,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirm: {
    flex: 1,
  },
});
