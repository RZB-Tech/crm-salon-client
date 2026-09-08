import React from 'react';
import { Alert, Box, Button, Skeleton, Text } from '@mantine/core';
import {
  useTenantPreferences,
  useUpdateTenantPreferences,
  type TenantPreferences,
} from '@/shared/api/hooks/useTenantPreferences';
import { ListPageShell, ListPageTitle, listPageStyles } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { useI18n } from '@/shared/lib/i18n';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { SettingsGeneralForm } from './SettingsGeneralForm';
import { SpecializationsSection } from './SpecializationsSection';
import styles from './settings-page.module.css';

export const SettingsPage: React.FC = () => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const { data: prefs, isLoading, isError } = useTenantPreferences();
  const updatePrefs = useUpdateTenantPreferences();
  const [form, setForm] = React.useState<TenantPreferences | null>(null);
  const canSave = hasPermission(PermissionCode.TENANT_PREFERENCES_UPDATE);

  useResetOnOpen(prefs, () => setForm((current) => current ?? prefs ?? null));

  const handleSave = React.useCallback(() => {
    if (!form) return;
    updatePrefs.mutate(form);
  }, [form, updatePrefs]);

  if (isLoading) {
    return (
      <ListPageShell toolbar={<ListPageTitle>{t('settings.title')}</ListPageTitle>}>
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
          {isMobile ? (
            <ListPageTitle>{t('settings.title')}</ListPageTitle>
          ) : (
            <Text size="sm" fw={700} c="#484848">
              {t('settings.title')}
            </Text>
          )}
          {!isMobile && canSave && (
            <Button color="sage.7" size="sm" onClick={handleSave} loading={updatePrefs.isPending}>
              {t('common.save')}
            </Button>
          )}
        </>
      }
      footer={
        isMobile && canSave ? (
          <Box className={listPageStyles.stickyBar}>
            <Button color="sage.7" size="md" fullWidth onClick={handleSave} loading={updatePrefs.isPending}>
              {t('common.save')}
            </Button>
          </Box>
        ) : undefined
      }
    >
      <Box className={styles.formSection}>
        <Text fw={600} size="lg" c="#484848" className={styles.sectionTitle}>
          {t('settings.general')}
        </Text>
        <SettingsGeneralForm form={form} onChange={setForm} />
      </Box>
      <Box className={styles.specSection}>
        <SpecializationsSection />
      </Box>
    </ListPageShell>
  );
};
