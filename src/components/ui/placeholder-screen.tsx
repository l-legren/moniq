import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { AppText } from '@/components/ui/text';

/** Temporary screen body for tabs/routes built in a later phase. */
export function PlaceholderScreen({ title }: { title: string }) {
  const { t } = useTranslation();

  return (
    <Screen>
      <View style={styles.center}>
        <AppText variant="title">{title}</AppText>
        <AppText variant="caption" color="text3">
          {t('placeholder.comingSoon')}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
