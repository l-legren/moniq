import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import {
  CATEGORY_ICONS,
  CATEGORY_IDS,
  CATEGORY_LABEL_KEYS,
  type CategoryId,
} from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

const TILE_ICON_SIZE = 26;
const TILE_BADGE_SIZE = 52;

type CategoryTileProps = {
  id: CategoryId;
  selected: boolean;
  onSelect: (id: CategoryId) => void;
};

function CategoryTile({ id, selected, onSelect }: CategoryTileProps) {
  const { t } = useTranslation();
  const { palette } = useAppTheme();
  const label = t(CATEGORY_LABEL_KEYS[id]);

  return (
    <Pressable
      onPress={() => onSelect(id)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={t('today.selectCategory', { category: label })}
      style={styles.tile}
    >
      <View
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
        style={[
          styles.badge,
          {
            backgroundColor: selected ? palette.accentLight : palette.card,
            borderColor: selected ? palette.accent : palette.hairline,
          },
        ]}
      >
        <Ionicons
          name={CATEGORY_ICONS[id]}
          size={TILE_ICON_SIZE}
          color={selected ? palette.accent : palette.text2}
        />
      </View>
      <AppText
        variant="caption"
        color={selected ? 'accent' : 'text2'}
        style={styles.label}
        numberOfLines={1}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

type CategoryGridProps = {
  category: CategoryId | null;
  onSelect: (id: CategoryId) => void;
};

/** Grid of icon tiles for picking an expense category — the icon set is shared app-wide via `CATEGORY_ICONS`. */
export function CategoryGrid({ category, onSelect }: CategoryGridProps) {
  return (
    <View style={styles.grid}>
      {CATEGORY_IDS.map((id) => (
        <CategoryTile key={id} id={id} selected={id === category} onSelect={onSelect} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  tile: {
    width: '30%',
    alignItems: 'center',
    gap: Spacing.two,
  },
  badge: {
    width: TILE_BADGE_SIZE,
    height: TILE_BADGE_SIZE,
    borderRadius: TILE_BADGE_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
  },
});
