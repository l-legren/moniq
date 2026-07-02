import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { AppText } from '@/components/ui/text';
import { FontFamily, Radius, Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

type TextFieldProps = TextInputProps & {
  label: string;
};

export function TextField({ label, style, accessibilityLabel, ...rest }: TextFieldProps) {
  const { palette } = useAppTheme();

  return (
    <View style={styles.container}>
      <AppText variant="sectionLabel" color="text3">
        {label}
      </AppText>
      <TextInput
        placeholderTextColor={palette.text3}
        accessibilityLabel={accessibilityLabel ?? label}
        style={[
          styles.input,
          { backgroundColor: palette.card, borderColor: palette.hairline, color: palette.text },
          style,
        ]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  input: {
    height: 48,
    borderRadius: Radius.base,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    fontFamily: FontFamily.regular,
    fontSize: 14,
  },
});
