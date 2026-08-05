import { Divider, Group, Paper, Stack, Text } from '@mantine/core';
import { formatDateTime } from '@/shared/lib/format';
import type { Staff } from '@/shared/api/types';

interface StaffDetailInfoProps {
  staff: Staff;
}

const infoRows: { label: string; value: (staff: Staff) => string }[] = [
  { label: 'ID', value: (staff) => String(staff.id) },
  { label: 'Логин', value: (staff) => staff.login },
  { label: 'Имя', value: (staff) => staff.firstname || '—' },
  { label: 'Фамилия', value: (staff) => staff.lastname || '—' },
  { label: 'Отчество', value: (staff) => staff.middlename || '—' },
  {
    label: 'Привязка к сотруднику',
    value: (staff) => (staff.employee_id ? `#${staff.employee_id}` : '—'),
  },
  { label: 'Создан', value: (staff) => formatDateTime(staff.created_at) },
  { label: 'Обновлён', value: (staff) => formatDateTime(staff.updated_at) },
];

export function StaffDetailInfo({ staff }: StaffDetailInfoProps) {
  return (
    <Paper p="md" withBorder>
      <Stack gap="xs">
        {infoRows.map((row, index) => (
          <div key={row.label}>
            {index > 0 && <Divider />}
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {row.label}
              </Text>
              <Text size="sm" fw={500}>
                {row.value(staff)}
              </Text>
            </Group>
          </div>
        ))}
      </Stack>
    </Paper>
  );
}
