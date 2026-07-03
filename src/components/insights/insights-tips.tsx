import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type TipCardProps = {
  title: string;
  body: string;
};

function TipCard({ title, body }: TipCardProps) {
  const { palette } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: palette.card }]}>
      <AppText variant="bodyMedium">{title}</AppText>
      <AppText variant="caption" color="text2">
        {body}
      </AppText>
    </View>
  );
}

export function InsightsTips() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <AppText variant="sectionLabel" color="text3">
        {t('insights.suggestions')}
      </AppText>
      <View style={styles.list}>
        <TipCard title={t('insights.tips.diningTitle')} body={t('insights.tips.diningBody')} />
        <TipCard title={t('insights.tips.weekendTitle')} body={t('insights.tips.weekendBody')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  list: {
    gap: Spacing.two,
  },
  card: {
    borderRadius: Radius.base,
    padding: Spacing.three,
    gap: Spacing.one,
  },
});
