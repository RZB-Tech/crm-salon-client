import { ActionIcon, Alert, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import { Check, Copy } from '@phosphor-icons/react';
import { useI18n } from '@/shared/lib/i18n';

interface ResetPasswordAlertProps {
  password: string;
  onClose: () => void;
}

export function ResetPasswordAlert({ password, onClose }: ResetPasswordAlertProps) {
  const { t } = useI18n();
  return (
    <Alert color="green" title={t('form.passwordResetTitle')} withCloseButton onClose={onClose}>
      <Group gap="xs">
        <Text size="sm">{t('form.newPasswordLabel')}</Text>
        <Text size="sm" fw={600} ff="monospace">
          {password}
        </Text>
        <CopyButton value={password}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? t('common.copied') : t('common.copy')}>
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
