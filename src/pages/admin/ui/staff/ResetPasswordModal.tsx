import {
  ActionIcon,
  Alert,
  Button,
  CopyButton,
  Group,
  Modal,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { Check, Copy } from '@phosphor-icons/react';

interface ResetPasswordModalProps {
  opened: boolean;
  onClose: () => void;
  staffLogin: string;
  resetResult: string | null;
  customPassword: string;
  onCustomPasswordChange: (value: string) => void;
  onResetRandom: () => void;
  isPending: boolean;
}

export function ResetPasswordModal({
  opened,
  onClose,
  staffLogin,
  resetResult,
  customPassword,
  onCustomPasswordChange,
  onResetRandom,
  isPending,
}: ResetPasswordModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={`Сброс пароля — ${staffLogin}`} size="sm">
      <Stack gap="sm">
        {!resetResult ? (
          <>
            <PasswordInput
              label="Новый пароль"
              description="Оставьте пустым для генерации случайного"
              value={customPassword}
              onChange={(e) => onCustomPasswordChange(e.currentTarget.value)}
              placeholder="Мин. 6 символов"
            />
            {customPassword && customPassword.length < 6 && (
              <Text size="xs" c="red">
                Минимум 6 символов
              </Text>
            )}
            <Button
              onClick={onResetRandom}
              loading={isPending}
              disabled={customPassword.length > 0 && customPassword.length < 6}
            >
              {customPassword ? 'Задать пароль' : 'Сгенерировать случайный'}
            </Button>
            {customPassword && (
              <Paper p="xs" withBorder>
                <Text size="xs" c="dimmed">
                  Пользовательский пароль пока не поддерживается бэкендом. Будет сгенерирован случайный.
                </Text>
              </Paper>
            )}
          </>
        ) : (
          <Alert color="green" title="Пароль установлен">
            <Group gap="xs">
              <Text size="sm">Новый пароль:</Text>
              <Text size="sm" fw={600} ff="monospace">
                {resetResult}
              </Text>
              <CopyButton value={resetResult}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? 'Скопировано' : 'Копировать'}>
                    <ActionIcon variant="subtle" size="sm" onClick={copy}>
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          </Alert>
        )}
      </Stack>
    </Modal>
  );
}
