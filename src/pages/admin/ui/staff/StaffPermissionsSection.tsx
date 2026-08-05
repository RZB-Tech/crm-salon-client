import { Badge, Button, Group, Paper, ScrollArea, Stack, Text } from '@mantine/core';
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
    <Paper p="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <Text size="sm" fw={600}>
            Индивидуальные разрешения
          </Text>
          <Badge size="sm" variant="light" color={staff.permissions.length > 0 ? 'teal' : 'gray'}>
            {staff.permissions.length}
          </Badge>
        </Group>
        <Button variant="subtle" size="xs" onClick={() => onEdit(staff)}>
          Изменить
        </Button>
      </Group>
      {staff.permissions.length > 0 ? (
        <ScrollArea.Autosize mah={150} type="auto">
          <Stack gap={4}>
            {getPermissionNames(staff.permissions).map((p) => (
              <Text key={p.code} size="xs" c="dimmed">
                {p.resource} → {p.name}
              </Text>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      ) : (
        <Text size="sm" c="dimmed">
          Нет прямых разрешений (только через роли)
        </Text>
      )}
    </Paper>
  );
}
