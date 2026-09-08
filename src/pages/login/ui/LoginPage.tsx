import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { LanguageSwitch } from '@/widgets/header/ui/LanguageSwitch';
import { useLogin } from '@/shared/api/hooks/useAuth';
import { useI18n } from '@/shared/lib/i18n';
import { useLoading } from '@/shared/lib/contexts/LoadingContext';
import loginBg from '@/shared/assets/login-bg.jpg';
import styles from './login-page.module.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { setIsLoading, setMessage } = useLoading();
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const loginMutation = useLogin();

  const canSubmit = Boolean(login && password) && !loginMutation.isPending;

  const handleSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (!canSubmit) return;

      loginMutation.mutate(
        { login, password },
        {
          onSuccess: () => {
            setMessage(t('common.loaderReady'));
            setIsLoading(true);
            navigate('/board', { replace: true });
          },
        },
      );
    },
    [canSubmit, login, loginMutation, navigate, password, setIsLoading, setMessage, t],
  );

  const togglePassword = React.useCallback(() => {
    setShowPassword((visible) => !visible);
  }, []);

  return (
    <div className={styles.page}>
      <img src={loginBg} alt="" className={styles.photo} />
      <div className={styles.photoShade} aria-hidden />
      <div className={styles.langSwitch}>
        <LanguageSwitch />
      </div>

      <section className={styles.panel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <header className={styles.formHeader}>
            <h1 className={styles.title}>{t('login.title')}</h1>
            <p className={styles.subtitle}>{t('login.subtitle')}</p>
          </header>

          <div className={styles.formBody}>
            <div className={styles.fields}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>{t('login.login')}</span>
                <input
                  className={styles.fieldInput}
                  type="text"
                  autoComplete="username"
                  value={login}
                  onChange={(event) => setLogin(event.currentTarget.value)}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>{t('login.password')}</span>
                <span className={styles.passwordWrap}>
                  <input
                    className={styles.fieldInput}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.currentTarget.value)}
                  />
                  <button
                    type="button"
                    className={styles.eye}
                    onClick={togglePassword}
                    tabIndex={-1}
                    aria-label={t('login.password')}
                  >
                    {showPassword ? <EyeSlashIcon size={20} /> : <EyeIcon size={20} />}
                  </button>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className={styles.submit}
              disabled={!canSubmit}
              aria-busy={loginMutation.isPending}
            >
              {t('login.submit')}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
