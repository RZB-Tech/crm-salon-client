import React from 'react';
import { Group, NumberInput, Select, Stack, Switch, TextInput } from '@mantine/core';
import type { TenantPreferences } from '@/shared/api/hooks/useTenantPreferences';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';

interface SettingsGeneralFormProps {
  form: TenantPreferences;
  onChange: (form: TenantPreferences) => void;
}

export const SettingsGeneralForm: React.FC<SettingsGeneralFormProps> = ({ form, onChange }) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  const themeField = (
    <Select
      label={t('settings.theme')}
      data={[
        { value: 'light', label: t('settings.light') },
        { value: 'dark', label: t('settings.dark') },
      ]}
      value={form.theme}
      onChange={(value) => onChange({ ...form, theme: (value as 'light' | 'dark') ?? 'light' })}
    />
  );
  const timezoneField = (
    <TextInput
      label={t('settings.timezone')}
      value={form.timezone}
      onChange={(event) => onChange({ ...form, timezone: event.currentTarget.value })}
    />
  );
  const currencyField = (
    <TextInput
      label={t('settings.currency')}
      value={form.currency}
      onChange={(event) => onChange({ ...form, currency: event.currentTarget.value })}
    />
  );
  const cancelDueField = (
    <NumberInput
      label={t('settings.cancelDue')}
      min={0}
      value={form.cancel_payment_due}
      onChange={(value) => onChange({ ...form, cancel_payment_due: Number(value) || 0 })}
    />
  );
  const telegramField = (
    <Switch
      label={t('settings.telegram')}
      checked={form.enable_telegram_booking}
      onChange={(event) =>
        onChange({ ...form, enable_telegram_booking: event.currentTarget.checked })
      }
    />
  );

  if (isMobile) {
    return (
      <Stack gap="md">
        {themeField}
        {timezoneField}
        {currencyField}
        {cancelDueField}
        {telegramField}
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Group grow>
        {themeField}
        {timezoneField}
      </Group>
      <Group grow>
        {currencyField}
        {cancelDueField}
      </Group>
      {telegramField}
    </Stack>
  );
};
