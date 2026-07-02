import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const DURATION = 220;

type CollapseProps = {
  expanded: boolean;
  children: ReactNode;
};

/**
 * Smoothly animates its content's height between 0 and its natural height, fading as it goes. Because
 * it animates a real layout height, siblings below get pushed up/down rather than snapping.
 *
 * The height is a shared value (so the worklet re-runs when the content grows/shrinks) measured on an
 * absolutely-positioned child (so its natural height is never affected by the animated, clipped
 * container height). Expected to start expanded — there's a brief in-flow frame before the first
 * measurement.
 */
export function Collapse({ expanded, children }: CollapseProps) {
  const contentHeight = useSharedValue(0);
  const progress = useSharedValue(expanded ? 1 : 0);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    progress.value = withTiming(expanded ? 1 : 0, {
      duration: DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [expanded, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    if (contentHeight.value === 0) return { opacity: progress.value };
    return { height: progress.value * contentHeight.value, opacity: progress.value };
  });

  const onLayout = (e: LayoutChangeEvent) => {
    contentHeight.value = e.nativeEvent.layout.height;
    if (!measured) setMeasured(true);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={measured ? styles.measured : undefined} onLayout={onLayout}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  // Out of flow once measured, so the animated container height can't feed back into measurement.
  measured: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});
