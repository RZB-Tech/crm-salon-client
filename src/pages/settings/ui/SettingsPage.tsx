import React from 'react';
import {
  Alert,
  Button,
  Card,
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
import { ListPage } from '@/shared/ui';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { SpecializationsSection } from './SpecializationsSection';

export const SettingsPage: React.FC = () => {
  const { hasPermission } = useAccess();
  const { data: prefs, isLoading, isError } = useTenantPreferences();
  const updatePrefs = useUpdateTenantPreferences();

  const [form, setForm] = React.useState<TenantPreferences | null>(null);

  // Инициализируем форму один раз при загрузке prefs, не затирая правки пользователя
  useResetOnOpen(prefs, () => setForm((current) => current ?? prefs ?? null));

  const handleSave = React.useCallback(() => {
    if (!form) return;
    updatePrefs.mutate(form);
  }, [form, updatePrefs]);

  if (isLoading) {
    return (
      <ListPage title="Настройки">
        <Skeleton height={300} radius="lg" />
      </ListPage>
    );
  }

  if (isError) {
    return (
      <ListPage title="Настройки">
        <Alert color="red" title="Не удалось загрузить настройки">
          Проверьте доступность API
        </Alert>
      </ListPage>
    );
  }

  if (!form) return null;

  return (
    <ListPage title="Настройки" subtitle="Параметры вашего салона">
      <Card padding="xl" radius="lg" shadow="xs">
        <Text fw={600} mb="md">
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
          {hasPermission(PermissionCode.TENANT_PREFERENCES_UPDATE) && (
            <Group justify="flex-end">
              <Button onClick={handleSave} loading={updatePrefs.isPending}>
                Сохранить настройки
              </Button>
            </Group>
          )}
        </Stack>
      </Card>

      <SpecializationsSection />
    </ListPage>
  );
};
