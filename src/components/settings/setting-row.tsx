import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type SettingRowProps = {
  label: string;
  children: ReactNode;
};

/** A labelled settings row with a control on the right (switch, etc.). */
export function SettingRow({ label, children }: SettingRowProps) {
  const { palette } = useAppTheme();

  return (
    <View style={[styles.row, { backgroundColor: palette.card }]}>
      <AppText>{label}</AppText>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.base,
  },
});
