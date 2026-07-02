import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { fmtR } from '@/services/money';

const MIN = 0;
const MAX = 1500;
const STEP = 10;

type SavingsFieldProps = {
  value: number;
  /** Live value as the slider moves (drives the preview). */
  onChange: (value: number) => void;
  /** Persist the value when the slider is released. */
  onCommit: (value: number) => void;
  /** Formatted daily allowance with the pending changes applied. */
  previewLabel: string;
};

export function SavingsField({ value, onChange, onCommit, previewLabel }: SavingsFieldProps) {
  const { t } = useTranslation();
  const { palette } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="sectionLabel" color="text3">
          {t('recurring.savingsTarget')}
        </AppText>
        <AppText variant="mono" color="accent2">
          {fmtR(value)}
        </AppText>
      </View>

      <Slider
        minimumValue={MIN}
        maximumValue={MAX}
        step={STEP}
        value={value}
        onValueChange={onChange}
        onSlidingComplete={onCommit}
        minimumTrackTintColor={palette.accent2}
        maximumTrackTintColor={palette.hairline}
        thumbTintColor={palette.accent2}
        accessibilityLabel={t('recurring.savingsTarget')}
      />

      <View
        accessible
        accessibilityLabel={`${t('recurring.previewLabel')} ${previewLabel}`}
        style={[styles.preview, { backgroundColor: palette.accent2Light }]}
      >
        <AppText
          variant="small"
          color="text2"
          style={styles.previewText}
          importantForAccessibility="no"
        >
          {t('recurring.previewLabel')}
        </AppText>
        <AppText variant="bodyMedium" color="accent2" importantForAccessibility="no">
          {previewLabel}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.base,
  },
  previewText: {
    flex: 1,
  },
});
