import { Tabs } from 'expo-router';
import { type ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/text';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

// Derive the tab-bar prop shape from expo-router's own Tabs (avoids the mismatched
// @react-navigation/bottom-tabs copy that pnpm resolves separately).
type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

type TabBarItemProps = {
  label: string;
  isFocused: boolean;
  onPress: () => void;
};

function TabBarItem({ label, isFocused, onPress }: TabBarItemProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isFocused }}
      accessibilityLabel={label}
      style={styles.tab}>
      <AppText variant="bodyMedium" color={isFocused ? 'accent' : 'text3'}>
        {label}
      </AppText>
    </Pressable>
  );
}

/** Minimal, text-only bottom tab bar: active label in accent, inactive in text3. */
export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { palette } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: palette.bg,
          borderTopColor: palette.hairline,
          paddingBottom: insets.bottom + Spacing.two,
        },
      ]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return <TabBarItem key={route.key} label={label} isFocused={isFocused} onPress={onPress} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.three,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
