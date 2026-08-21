import { Button, Group, Stack, Text } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';
import { FormSection, formModalStyles } from '@/shared/ui';
import type { Staff } from '@/shared/api/types';

interface StaffRolesSectionProps {
  staff: Staff;
  onEdit: (staff: Staff) => void;
}

export function StaffRolesSection({ staff, onEdit }: StaffRolesSectionProps) {
  const { t } = useI18n();
  return (
    <FormSection title={t('admin.roles')}>
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          {staff.roles.length > 0 ? (
            staff.roles.map((role) => (
              <Text key={role.id} size="sm" fw={500}>
                {role.name}
                {role.description && (
                  <Text span size="xs" c="dimmed" fw={400}>
                    {' '}
                    — {role.description}
                  </Text>
                )}
              </Text>
            ))
          ) : (
            <div className={formModalStyles.emptyState}>{t('admin.noRoles')}</div>
          )}
        </Stack>
        <Button variant="subtle" size="compact-xs" onClick={() => onEdit(staff)}>
          {t('common.change')}
        </Button>
      </Group>
    </FormSection>
  );
}
