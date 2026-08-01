import React from 'react';
import {
  Alert,
  Box,
  Button,
  Group,
  NumberInput,
  Select,
  Skeleton,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import {
  useTenantPreferences,
  useUpdateTenantPreferences,
  type TenantPreferences,
} from '@/shared/api/hooks/useTenantPreferences';
import { ListPageShell } from '@/shared/ui';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { SpecializationsSection } from './SpecializationsSection';
import styles from './settings-page.module.css';

export const SettingsPage: React.FC = () => {
  const { hasPermission } = useAccess();
  const { data: prefs, isLoading, isError } = useTenantPreferences();
  const updatePrefs = useUpdateTenantPreferences();

  const [form, setForm] = React.useState<TenantPreferences | null>(null);

  useResetOnOpen(prefs, () => setForm((current) => current ?? prefs ?? null));

  const handleSave = React.useCallback(() => {
    if (!form) return;
    updatePrefs.mutate(form);
  }, [form, updatePrefs]);

  if (isLoading) {
    return (
      <ListPageShell
        toolbar={
          <Text size="sm" fw={700} c="#484848">
            Настройки
          </Text>
        }
      >
        <Box p="md">
          <Skeleton height={300} radius="md" />
        </Box>
      </ListPageShell>
    );
  }

  if (isError) {
    return (
      <ListPageShell>
        <Box p="xl">
          <Alert color="red" title="Не удалось загрузить настройки">
            Проверьте доступность API
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  if (!form) return null;

  return (
    <ListPageShell
      toolbar={
        <>
          <Text size="sm" fw={700} c="#484848">
            Настройки
          </Text>
          {hasPermission(PermissionCode.TENANT_PREFERENCES_UPDATE) && (
            <Button color="sage.7" size="sm" onClick={handleSave} loading={updatePrefs.isPending}>
              Сохранить
            </Button>
          )}
        </>
      }
    >
      <Box className={styles.formSection}>
        <Text fw={600} size="sm" c="#484848" className={styles.sectionTitle}>
          Общие
        </Text>
        <Stack gap="md">
          <Group grow>
            <Select
              label="Тема"
              data={[
                { value: 'light', label: 'Светлая' },
                { value: 'dark', label: 'Тёмная' },
              ]}
              value={form.theme}
              onChange={(v) => setForm({ ...form, theme: (v as 'light' | 'dark') ?? 'light' })}
            />
            <TextInput
              label="Часовой пояс"
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.currentTarget.value })}
            />
          </Group>
          <Group grow>
            <TextInput
              label="Валюта"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.currentTarget.value })}
            />
            <NumberInput
              label="Срок отмены оплаты (часы)"
              min={0}
              value={form.cancel_payment_due}
              onChange={(v) => setForm({ ...form, cancel_payment_due: Number(v) || 0 })}
            />
          </Group>
          <Switch
            label="Telegram-бронирование"
            checked={form.enable_telegram_booking}
            onChange={(e) =>
              setForm({ ...form, enable_telegram_booking: e.currentTarget.checked })
            }
          />
        </Stack>
      </Box>

      <Box className={styles.specSection}>
        <SpecializationsSection />
      </Box>
    </ListPageShell>
  );
};
