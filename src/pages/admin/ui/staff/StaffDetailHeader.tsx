import { Badge, Box, Group, Paper, Text } from '@mantine/core';
import type { Staff } from '@/shared/api/types';

interface StaffDetailHeaderProps {
  staff: Staff;
}

export function StaffDetailHeader({ staff }: StaffDetailHeaderProps) {
  return (
    <Paper p="md" withBorder>
      <Group justify="space-between" align="flex-start">
        <Box>
          <Text size="lg" fw={600}>
            {[staff.firstname, staff.middlename, staff.lastname].filter(Boolean).join(' ') || '—'}
          </Text>
          <Text size="sm" c="dimmed">
            {staff.login}
          </Text>
        </Box>
        <Badge color={staff.active ? 'green' : 'gray'} variant="dot" size="lg">
          {staff.active ? 'Активен' : 'Неактивен'}
        </Badge>
      </Group>
    </Paper>
  );
}
