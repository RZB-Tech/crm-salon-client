import React from 'react';
import { Alert, Skeleton, Table, Text } from '@mantine/core';
import { useAuditLogs } from '@/shared/api/hooks/useAuditLogs';
import type { AuditLogTable } from '@/shared/api/types';
import { formatDateTime } from '@/shared/lib/format';
import styles from './audit-logs-panel.module.css';

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

  if (items.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        Изменений пока нет
      </Text>
    );
  }

  return (
    <div className={styles.panel}>
      <Table verticalSpacing="xs" withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Дата</Table.Th>
            <Table.Th>Действие</Table.Th>
            <Table.Th>Поле</Table.Th>
            <Table.Th>Было</Table.Th>
            <Table.Th>Стало</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.map((log) => (
            <Table.Tr key={log.id}>
              <Table.Td>
                <Text size="xs">{formatDateTime(log.changed_at)}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="xs">{log.action}</Text>
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
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};
