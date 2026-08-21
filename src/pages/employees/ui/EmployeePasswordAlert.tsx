import React from 'react';
import { ActionIcon, Alert, Code, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { useI18n } from '@/shared/lib/i18n';

interface EmployeePasswordAlertProps {
  password: string;
  onClose: () => void;
}

export const EmployeePasswordAlert: React.FC<EmployeePasswordAlertProps> = ({
  password,
  onClose,
}) => {
  const { t } = useI18n();

  return (
    <Alert color="sage" title={t('form.passwordResetTitle')} onClose={onClose} withCloseButton>
      <Group gap="sm">
        <Text size="sm" fw={600}>
          {t('form.newPasswordLabel')} <Code>{password}</Code>
        </Text>
        <CopyButton value={password}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? t('employees.copiedExclaim') : t('employees.copyAction')} withArrow>
              <ActionIcon color={copied ? 'teal' : 'sage'} variant="light" onClick={copy} size="sm">
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </Group>
      <Text size="xs" c="dimmed" mt="xs">
        {t('employees.passToEmployee')}
      </Text>
    </Alert>
  );
};
