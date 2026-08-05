import { ActionIcon, Alert, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import { Check, Copy } from '@phosphor-icons/react';

interface ResetPasswordAlertProps {
  password: string;
  onClose: () => void;
}

export function ResetPasswordAlert({ password, onClose }: ResetPasswordAlertProps) {
  return (
    <Alert color="green" title="Пароль сброшен" withCloseButton onClose={onClose}>
      <Group gap="xs">
        <Text size="sm">Новый пароль:</Text>
        <Text size="sm" fw={600} ff="monospace">
          {password}
        </Text>
        <CopyButton value={password}>
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
  );
}
