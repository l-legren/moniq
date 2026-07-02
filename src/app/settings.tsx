import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '@/components/ui/placeholder-screen';

export default function SettingsScreen() {
  const { t } = useTranslation();
  return <PlaceholderScreen title={t('settings.title')} />;
}
