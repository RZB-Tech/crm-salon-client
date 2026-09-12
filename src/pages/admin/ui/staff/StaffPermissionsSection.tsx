import { Button, Group, ScrollArea, Stack, Text } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';
import { FormSection, formModalStyles } from '@/shared/ui';
import type { Permission, Staff } from '@/shared/api/types';

interface StaffPermissionsSectionProps {
  staff: Staff;
  getPermissionNames: (codes: number[]) => Permission[];
  onEdit: (staff: Staff) => void;
}

export function StaffPermissionsSection({
  staff,
  getPermissionNames,
  onEdit,
}: StaffPermissionsSectionProps) {
  const { t } = useI18n();
  return (
    <FormSection
      title={t('admin.permsWithCount', { count: staff.permissions.length })}
      hint={t('admin.permsHint')}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
        <div style={{ flex: 1, minWidth: 0 }}>
          {staff.permissions.length > 0 ? (
            <ScrollArea.Autosize mah={150} type="auto">
              <Stack gap={4}>
                {getPermissionNames(staff.permissions).map((permission) => {
                  const resourceKey = `permissions.resources.${permission.resource}`;
                  const resourceLabel = t(resourceKey);
                  const displayResource = resourceLabel === resourceKey ? permission.resource : resourceLabel;
                  const permKey = `permissions.codes.${permission.code}`;
                  const permLabel = t(permKey);
                  const displayName = permLabel === permKey ? permission.name : permLabel;
                  return (
                    <Text key={permission.code} size="xs" c="dimmed">
                      {displayResource} → {displayName}
                    </Text>
                  );
                })}
              </Stack>
            </ScrollArea.Autosize>
          ) : (
            <div className={formModalStyles.emptyState}>
              {t('admin.noDirectPerms')}
            </div>
          )}
        </div>
        <Button variant="subtle" size="compact-xs" onClick={() => onEdit(staff)}>
          {t('common.change')}
        </Button>
      </Group>
    </FormSection>
  );
}
