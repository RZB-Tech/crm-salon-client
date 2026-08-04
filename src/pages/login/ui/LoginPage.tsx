import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, PasswordInput, Text, TextInput } from '@mantine/core';
import { useLogin } from '@/shared/api/hooks/useAuth';
import { useLoading } from '@/shared/lib/contexts/LoadingContext';
import LogoSvg from '@/shared/assets/logo.svg?url';
import styles from './login-page.module.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsLoading, setMessage } = useLoading();
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const loginMutation = useLogin();

  const handleSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!login || !password || loginMutation.isPending) return;

    loginMutation.mutate(
      { login, password },
      { 
        onSuccess: () => {
          setMessage('Загрузка данных...');
          setIsLoading(true);
          navigate('/board', { replace: true });
        } 
      },
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.atmosphere} aria-hidden>
        <span className={styles.orb} data-orb="a" />
        <span className={styles.orb} data-orb="b" />
        <span className={styles.orb} data-orb="c" />
        <span className={styles.grain} />
      </div>

      <section className={styles.brand}>
        <div className={styles.brandGlow} aria-hidden />
        <img src={LogoSvg} alt="Salon CRM" className={styles.logo} />
        <p className={styles.brandLine}>Рабочее пространство салона</p>
        <div className={styles.curve} aria-hidden />
      </section>

      <section className={styles.panel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <header className={styles.formHeader}>
            <Text component="h1" className={styles.title}>
              Вход
            </Text>
            <Text className={styles.subtitle}>Введите логин и пароль, чтобы продолжить</Text>
          </header>

          <div className={styles.fields}>
            <TextInput
              label="Логин"
              required
              autoComplete="username"
              value={login}
              onChange={(e) => setLogin(e.currentTarget.value)}
            />
            <PasswordInput
              label="Пароль"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            size="md"
            className={styles.submit}
            loading={loginMutation.isPending}
            disabled={!login || !password}
          >
            Войти
          </Button>
        </form>
      </section>
    </div>
  );
};
