import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import { useLogin } from '@/shared/api/hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const loginMutation = useLogin();

  const handleSubmit = React.useCallback(() => {
    loginMutation.mutate(
      { login, password },
      { onSuccess: () => navigate('/board', { replace: true }) },
    );
  }, [login, password, loginMutation, navigate]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--mantine-color-gray-0)',
        padding: 24,
      }}
    >
      <Card padding="xl" radius="lg" shadow="sm" w={400}>
        <Stack gap="md">
          <div>
            <Title order={3}>Salon CRM</Title>
            <Text size="sm" c="dimmed" mt={4}>
              Войдите в систему
            </Text>
          </div>
          <TextInput
            label="Логин"
            required
            value={login}
            onChange={(e) => setLogin(e.currentTarget.value)}
          />
          <PasswordInput
            label="Пароль"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Button
            onClick={handleSubmit}
            loading={loginMutation.isPending}
            disabled={!login || !password}
          >
            Войти
          </Button>
        </Stack>
      </Card>
    </div>
  );
};
