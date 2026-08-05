import { Badge, Button, Group, Paper, Text } from '@mantine/core';
import type { Staff } from '@/shared/api/types';

interface StaffRolesSectionProps {
  staff: Staff;
  onEdit: (staff: Staff) => void;
}

export function StaffRolesSection({ staff, onEdit }: StaffRolesSectionProps) {
  return (
    <Paper p="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={600}>
          Роли
        </Text>
        <Button variant="subtle" size="xs" onClick={() => onEdit(staff)}>
          Изменить
        </Button>
      </Group>
      {staff.roles.length > 0 ? (
        <Group gap="xs">
          {staff.roles.map((r) => (
            <Badge key={r.id} variant="light" color="blue">
              {r.name}
            </Badge>
          ))}
        </Group>
      ) : (
        <Text size="sm" c="dimmed">
          Нет назначенных ролей
        </Text>
      )}
    </Paper>
  );
}
