import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import type { AuthMode } from '@/components/auth/auth-mode';
import { AuthForm } from '@/components/auth/auth-form';
import { AuthHeader } from '@/components/auth/auth-header';
import { AuthLogo } from '@/components/auth/auth-logo';
import { ModeToggle } from '@/components/auth/mode-toggle';
import { Screen } from '@/components/ui/screen';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';
import { AuthServiceError, type AuthErrorCode } from '@/services/auth.service';

const CONTENT_TOP_PADDING = 64;
const CONTENT_BOTTOM_PADDING = 40;
const HEADER_BLOCK_GAP = 36;
const LOGO_BOTTOM_MARGIN = 14;

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signIn } = useAuth();

  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorCode, setErrorCode] = useState<AuthErrorCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignUp = mode === 'signup';

  const handleSubmit = async () => {
    setErrorCode(null);

    if (isSignUp) {
      // Sign-up isn't wired to a backend yet — design-only for now.
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setErrorCode(err instanceof AuthServiceError ? err.code : 'unknown');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    // Password reset isn't wired to a backend yet — design-only for now.
  };

  const toggleMode = () => {
    setMode((current) => (current === 'login' ? 'signup' : 'login'));
    setErrorCode(null);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <View style={styles.logoSpacing}>
            <AuthLogo />
          </View>
          <AuthHeader
            headline={t(isSignUp ? 'auth.signUpHeadline' : 'auth.loginHeadline')}
            subline={t(isSignUp ? 'auth.signUpSubline' : 'auth.loginSubline')}
          />
        </View>

        <AuthForm
          mode={mode}
          name={name}
          onChangeName={setName}
          email={email}
          onChangeEmail={setEmail}
          password={password}
          onChangePassword={setPassword}
          onForgotPassword={handleForgotPassword}
          errorCode={errorCode}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />

        <ModeToggle mode={mode} onToggle={toggleMode} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
  },
  content: {
    paddingTop: CONTENT_TOP_PADDING,
    paddingBottom: CONTENT_BOTTOM_PADDING,
    paddingHorizontal: Spacing.four,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: HEADER_BLOCK_GAP,
  },
  logoSpacing: {
    marginBottom: LOGO_BOTTOM_MARGIN,
  },
});
