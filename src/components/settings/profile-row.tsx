import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/text';
import { PROFILE } from '@/constants/profile';
import { Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export function ProfileRow() {
  const { palette } = useAppTheme();

  return (
    <View
      accessible
      accessibilityLabel={`${PROFILE.name}, ${PROFILE.email}`}
      style={[styles.card, { backgroundColor: palette.card }]}
    >
      <View
        importantForAccessibility="no"
        style={[styles.avatar, { backgroundColor: palette.accentLight }]}
      >
        <AppText variant="title" color="accent">
          {PROFILE.initial}
        </AppText>
      </View>
      <View importantForAccessibility="no-hide-descendants">
        <AppText variant="bodyMedium">{PROFILE.name}</AppText>
        <AppText variant="caption" color="text3">
          {PROFILE.email}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.base,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
