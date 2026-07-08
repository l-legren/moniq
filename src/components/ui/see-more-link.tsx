import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';

type SeeMoreLinkProps = {
  /** Section name, interpolated into the accessibility label (e.g. "See all Income"). */
  section: string;
  onPress: () => void;
};

/** Always-visible link out of a widget-card preview into its full Detail listing. */
export function SeeMoreLink({ section, onPress }: SeeMoreLinkProps) {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={t('common.seeMoreOf', { section })}
      style={styles.seeMore}
    >
      <AppText variant="caption" color="accent">
        {t('common.seeMore')}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  seeMore: {
    paddingTop: Spacing.three,
  },
});
