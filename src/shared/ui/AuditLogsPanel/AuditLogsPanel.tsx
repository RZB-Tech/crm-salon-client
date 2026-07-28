import React from 'react';
import { Alert, Skeleton, Table, Text } from '@mantine/core';
import { useAuditLogs } from '@/shared/api/hooks/useAuditLogs';
import { useEmployees } from '@/shared/api/hooks/useEmployees';
import type { AuditLogTable } from '@/shared/api/types';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatDateTime, getEmployeeFullName } from '@/shared/lib/format';

interface AuditLogsPanelProps {
  tableName: AuditLogTable;
  recordId: number;
}

export const AuditLogsPanel: React.FC<AuditLogsPanelProps> = ({ tableName, recordId }) => {
  const { data, isLoading, isError } = useAuditLogs({
    table_name: tableName,
    record_id: recordId,
    page: 1,
    pageSize: 50,
  });
  const { data: employees } = useEmployees();

  const employeeMap = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const e of employees ?? []) {
      map.set(e.id, getEmployeeFullName(e));
    }
    return map;
  }, [employees]);

  if (isLoading) {
    return <Skeleton height={120} radius="md" />;
  }

  if (isError) {
    return (
      <Alert color="red" title="Не удалось загрузить историю">
        Проверьте доступность API
      </Alert>
    );
  }

  const items = data?.items ?? [];

  return (
    <DataTable
      compact
      stickyHeader={false}
      maxHeight={360}
      columns={[
        { key: 'date', label: 'Дата' },
        { key: 'who', label: 'Кто' },
        { key: 'action', label: 'Действие' },
        { key: 'field', label: 'Поле' },
        { key: 'old', label: 'Было' },
        { key: 'new', label: 'Стало' },
      ]}
      isEmpty={items.length === 0}
      emptyMessage="Изменений пока нет"
    >
      {items.map((log) => (
        <DataTableRow key={log.id}>
          <Table.Td>
            <Text size="xs">{formatDateTime(log.changed_at)}</Text>
          </Table.Td>
          <Table.Td>
            <Text size="xs" fw={500}>
              {employeeMap.get(log.changed_by) ?? `#${log.changed_by}`}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="xs" fw={500}>
              {log.action}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="xs">{log.field_name}</Text>
          </Table.Td>
          <Table.Td>
            <Text size="xs" c="dimmed">
              {log.old_value ?? '—'}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="xs">{log.new_value ?? '—'}</Text>
          </Table.Td>
        </DataTableRow>
      ))}
    </DataTable>
  );
};
