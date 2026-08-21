import { ActionIcon, CopyButton, Group, Text, Tooltip } from '@mantine/core';
import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { useI18n } from '@/shared/lib/i18n';

interface BranchSecretRowProps {
  label: string;
  value: string;
}

export function BranchSecretRow({ label, value }: BranchSecretRowProps) {
  const { t } = useI18n();
  return (
    <Group gap="xs" mb="xs" wrap="nowrap">
      <Text size="sm" c="dimmed" w={72}>
        {label}
      </Text>
      <Text size="sm" fw={600} ff="monospace" style={{ flex: 1 }}>
        {value}
      </Text>
      <CopyButton value={value}>
        {({ copied, copy }) => (
          <Tooltip label={copied ? t('common.copied') : t('common.copy')}>
            <ActionIcon variant="subtle" size="sm" onClick={copy}>
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            </ActionIcon>
          </Tooltip>
        )}
      </CopyButton>
    </Group>
  );
}
