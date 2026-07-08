import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

import { AppText } from '@/components/ui/text';
import { WidgetCard } from '@/components/ui/widget-card';
import { FontFamily, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import type { InsightsBar } from '@/hooks/use-insights';

const CHART_HEIGHT = 150;
const BAR_WIDTH = 18;
const INITIAL_SPACING = 12;

type InsightsChartProps = {
  title: string;
  footer: string;
  bars: InsightsBar[];
};

export function InsightsChart({ title, footer, bars }: InsightsChartProps) {
  const { t } = useTranslation();
  const { palette } = useAppTheme();
  const [width, setWidth] = useState(0);

  const hasData = bars.some((bar) => bar.value > 0);
  const data = bars.map((bar) => ({
    value: bar.value,
    label: bar.label,
    frontColor: bar.tone === 'bad' ? palette.bad : palette.good,
  }));

  // Distribute the bars evenly across the measured width.
  const count = bars.length || 1;
  const spacing =
    width > 0 ? Math.max(8, (width - INITIAL_SPACING - count * BAR_WIDTH) / count) : 20;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <WidgetCard>
      <View style={styles.container} onLayout={onLayout}>
        <AppText variant="sectionLabel" color="text3">
          {title}
        </AppText>

        {hasData ? (
          <BarChart
            data={data}
            width={width || undefined}
            height={CHART_HEIGHT}
            barWidth={BAR_WIDTH}
            spacing={spacing}
            initialSpacing={INITIAL_SPACING}
            barBorderTopLeftRadius={Radius.base}
            barBorderTopRightRadius={Radius.base}
            hideRules
            hideYAxisText
            yAxisThickness={0}
            xAxisThickness={0}
            disableScroll
            xAxisLabelTextStyle={{
              color: palette.text3,
              fontFamily: FontFamily.regular,
              fontSize: 11,
            }}
          />
        ) : (
          <AppText variant="caption" color="text3" style={styles.empty}>
            {t('insights.noData')}
          </AppText>
        )}

        <AppText variant="small" color="text3">
          {footer}
        </AppText>
      </View>
    </WidgetCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  empty: {
    paddingVertical: Spacing.five,
  },
});
