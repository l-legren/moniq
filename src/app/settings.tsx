import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch } from 'react-native';

import { ProfileRow } from '@/components/settings/profile-row';
import { SettingRow } from '@/components/settings/setting-row';
import { SettingsHeader } from '@/components/settings/settings-header';
import { SettingsSection } from '@/components/settings/settings-section';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isDark, toggle, palette } = useAppTheme();

  // Auth is out of scope for the MVP — these are intentional non-functional stubs.
  const noop = () => {};

  return (
    <Screen edges={['top']} background="flat">
      <SettingsHeader onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ProfileRow />

        <SettingsSection label={t('settings.appearance')}>
          <SettingRow label={t('settings.darkMode')}>
            <Switch
              value={isDark}
              onValueChange={toggle}
              trackColor={{ false: palette.hairline, true: palette.accent }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={palette.hairline}
              accessibilityLabel={t('settings.darkMode')}
            />
          </SettingRow>
        </SettingsSection>

        <SettingsSection label={t('settings.account')}>
          <Button variant="secondary" label={t('settings.logOut')} onPress={noop} />
          <Button variant="destructive" label={t('settings.deleteAccount')} onPress={noop} />
        </SettingsSection>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.five,
  },
});
