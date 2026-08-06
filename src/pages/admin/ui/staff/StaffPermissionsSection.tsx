import { Button, Group, ScrollArea, Stack, Text } from '@mantine/core';
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
  return (
    <FormSection
      title={`Индивидуальные разрешения · ${staff.permissions.length}`}
      hint="Добавляются к правам, полученным через роли"
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
        <div style={{ flex: 1, minWidth: 0 }}>
          {staff.permissions.length > 0 ? (
            <ScrollArea.Autosize mah={150} type="auto">
              <Stack gap={4}>
                {getPermissionNames(staff.permissions).map((permission) => (
                  <Text key={permission.code} size="xs" c="dimmed">
                    {permission.resource} → {permission.name}
                  </Text>
                ))}
              </Stack>
            </ScrollArea.Autosize>
          ) : (
            <div className={formModalStyles.emptyState}>
              Нет прямых разрешений — доступ только через роли
            </div>
          )}
        </div>
        <Button variant="subtle" size="compact-xs" onClick={() => onEdit(staff)}>
          Изменить
        </Button>
      </Group>
    </FormSection>
  );
}
