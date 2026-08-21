import React from 'react';
import { Alert, Skeleton, Table, Text } from '@mantine/core';
import { useAuditLogs } from '@/shared/api/hooks/useAuditLogs';
import { useEmployees } from '@/shared/api/hooks/useEmployees';
import type { AuditLogTable } from '@/shared/api/types';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatDateTime, getEmployeeFullName } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';

interface AuditLogsPanelProps {
  tableName: AuditLogTable;
  recordId: number;
  whoLabel?: string;
  className?: string;
  hideEmptyIcon?: boolean;
}

export const AuditLogsPanel: React.FC<AuditLogsPanelProps> = ({
  tableName,
  recordId,
  whoLabel,
  className,
  hideEmptyIcon,
}) => {
  const { t } = useI18n();
  const resolvedWho = whoLabel ?? t('admin.who');
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
      <Alert color="red" title={t('admin.historyLoadError')}>
        {t('common.checkApi')}
      </Alert>
    );
  }

  const items = data?.items ?? [];

  return (
    <DataTable
      compact
      stickyHeader={false}
      maxHeight={360}
      className={className}
      hideEmptyIcon={hideEmptyIcon}
      columns={[
        { key: 'date', label: t('common.date') },
        { key: 'who', label: resolvedWho },
        { key: 'action', label: t('admin.action') },
        { key: 'field', label: t('admin.field') },
        { key: 'old', label: t('admin.was') },
        { key: 'new', label: t('admin.became') },
      ]}
      isEmpty={items.length === 0}
      emptyMessage={t('admin.noChanges')}
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
              {log.old_value ?? t('common.dash')}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text size="xs">{log.new_value ?? t('common.dash')}</Text>
          </Table.Td>
        </DataTableRow>
      ))}
    </DataTable>
  );
};
