import { ActionIcon, Alert, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { useI18n } from '@/shared/lib/i18n';

interface PasswordResultAlertProps {
  title: string;
  label: string;
  password: string;
}

export function PasswordResultAlert({ title, label, password }: PasswordResultAlertProps) {
  const { t } = useI18n();
  return (
    <Alert color="green" title={title} radius="md" mb="sm">
      <Group gap="xs">
        <Text size="sm">{label}</Text>
        <Text size="sm" fw={600} ff="monospace">
          {password}
        </Text>
        <CopyButton value={password}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? t('common.copied') : t('common.copy')}>
              <ActionIcon variant="subtle" size="sm" onClick={copy}>
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Group>
    </Alert>
  );
}
