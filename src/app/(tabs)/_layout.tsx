import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { TabBar } from '@/components/navigation/tab-bar';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: t('tabs.today') }} />
      <Tabs.Screen name="recurring" options={{ title: t('tabs.recurring') }} />
      <Tabs.Screen name="insights" options={{ title: t('tabs.insights') }} />
    </Tabs>
  );
}
