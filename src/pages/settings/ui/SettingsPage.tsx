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
import { useI18n } from '@/shared/lib/i18n';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { SpecializationsSection } from './SpecializationsSection';
import styles from './settings-page.module.css';

export const SettingsPage: React.FC = () => {
  const { t } = useI18n();
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
            {t('settings.title')}
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
          <Alert color="red" title={t('settings.loadError')}>
            {t('common.checkApi')}
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
            {t('settings.title')}
          </Text>
          {hasPermission(PermissionCode.TENANT_PREFERENCES_UPDATE) && (
            <Button color="sage.7" size="sm" onClick={handleSave} loading={updatePrefs.isPending}>
              {t('common.save')}
            </Button>
          )}
        </>
      }
    >
      <Box className={styles.formSection}>
        <Text fw={600} size="sm" c="#484848" className={styles.sectionTitle}>
          {t('settings.general')}
        </Text>
        <Stack gap="md">
          <Group grow>
            <Select
              label={t('settings.theme')}
              data={[
                { value: 'light', label: t('settings.light') },
                { value: 'dark', label: t('settings.dark') },
              ]}
              value={form.theme}
              onChange={(v) => setForm({ ...form, theme: (v as 'light' | 'dark') ?? 'light' })}
            />
            <TextInput
              label={t('settings.timezone')}
              value={form.timezone}
              onChange={(e) => setForm({ ...form, timezone: e.currentTarget.value })}
            />
          </Group>
          <Group grow>
            <TextInput
              label={t('settings.currency')}
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.currentTarget.value })}
            />
            <NumberInput
              label={t('settings.cancelDue')}
              min={0}
              value={form.cancel_payment_due}
              onChange={(v) => setForm({ ...form, cancel_payment_due: Number(v) || 0 })}
            />
          </Group>
          <Switch
            label={t('settings.telegram')}
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
