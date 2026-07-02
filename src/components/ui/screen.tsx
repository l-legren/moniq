import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import type { ViewProps } from 'react-native';

import { useAppTheme } from '@/hooks/use-app-theme';

type Props = ViewProps & {
  /** Which safe-area edges to inset. Defaults to all. */
  edges?: readonly Edge[];
};

/** Full-screen container with the warm background + safe-area insets. */
export function Screen({ style, edges, children, ...rest }: Props) {
  const { palette } = useAppTheme();

  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: palette.bg }, style]} {...rest}>
      {children}
    </SafeAreaView>
  );
}
