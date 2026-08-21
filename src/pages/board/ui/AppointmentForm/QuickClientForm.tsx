import React from 'react';
import { Button, Group, SegmentedControl, Stack, Text, TextInput } from '@mantine/core';
import { useCreateClient } from '@/shared/api/hooks/useClients';
import type { Sex } from '@/shared/api/types';
import { SEX_OPTIONS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import styles from './appointment-form-modal.module.css';

interface QuickClientFormProps {
  onCreated: (clientId: string) => void;
  onCancel: () => void;
}

export const QuickClientForm: React.FC<QuickClientFormProps> = ({ onCreated, onCancel }) => {
  const { t } = useI18n();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [sex, setSex] = React.useState<Sex>('female');
  const createClient = useCreateClient();

  const handleCreate = React.useCallback(() => {
    createClient.mutate(
      {
        firstname: name.trim(),
        phone: phone.trim() || undefined,
        sex,
      },
      {
        onSuccess: (created) => {
          onCreated(String(created.id));
        },
      },
    );
  }, [name, phone, sex, createClient, onCreated]);

  return (
    <div className={styles.quickClientPanel}>
      <p className={styles.sectionTitle}>{t('clients.newClient')}</p>
      <Stack gap="xs">
        <Group grow>
          <TextInput
            label={t('common.firstName')}
            required
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            placeholder={t('board.clientNamePh')}
            autoFocus
          />
          <TextInput
            label={t('common.phone')}
            value={phone}
            onChange={(event) => setPhone(event.currentTarget.value)}
            placeholder="+998..."
          />
        </Group>
        <div>
          <Text size="sm" fw={500} mb={4}>
            {t('clients.sex')}{' '}
            <Text span c="red">
              *
            </Text>
          </Text>
          <SegmentedControl
            fullWidth
            data={[...SEX_OPTIONS()]}
            value={sex}
            onChange={(value) => setSex(value as Sex)}
          />
        </div>
        <Group gap="xs" justify="flex-end">
          <Button variant="subtle" color="gray" size="xs" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            size="xs"
            disabled={!name.trim()}
            loading={createClient.isPending}
            onClick={handleCreate}
          >
            {t('board.createClient')}
          </Button>
        </Group>
      </Stack>
    </div>
  );
};
