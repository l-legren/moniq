import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';

/** "Scroll for balance" + chevron. Content is AT-hidden; the pager wraps it in a labelled button. */
export function ScrollHint() {
  const { t } = useTranslation();

  return (
    <View style={styles.row}>
      <AppText variant="small" color="text3" importantForAccessibility="no" accessibilityElementsHidden>
        {t('today.scrollForBalance')}
      </AppText>
      <AppText variant="small" color="text3" importantForAccessibility="no" accessibilityElementsHidden>
        ⌄
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
});
