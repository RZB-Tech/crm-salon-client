import React from 'react';
import { ActionIcon, Badge, Group, Table, Text, Tooltip } from '@mantine/core';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import type { SalonNotification } from '@/shared/api/types';
import { listPageStyles, SortableTh } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { getEffectiveStatus } from '@/shared/lib/notifications/notificationDelivery';
import { formatDateTime, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/format';

interface NotificationsTableProps extends TableSortProps {
  items: SalonNotification[];
  cancelPending: boolean;
  onMarkRead: (id: number) => void;
  onCancel: (id: number) => void;
}

export const NotificationsTable: React.FC<NotificationsTableProps> = ({
  items,
  sort,
  onSort,
  cancelPending,
  onMarkRead,
  onCancel,
}) => (
  <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
    <Table.Thead>
      <Table.Tr>
        <SortableTh column="type" sort={sort} onSort={onSort}>
          Тип
        </SortableTh>
        <Table.Th className={listPageStyles.headCell}>Заголовок</Table.Th>
        <Table.Th className={listPageStyles.headCell}>Текст</Table.Th>
        <SortableTh column="status" sort={sort} onSort={onSort} w={140}>
          Статус
        </SortableTh>
        <SortableTh column="scheduled" sort={sort} onSort={onSort} w={180}>
          Запланировано
        </SortableTh>
        <Table.Th className={listPageStyles.headCell} w={100} />
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {items.length === 0 ? (
        <Table.Tr>
          <Table.Td colSpan={6}>
            <Text size="sm" c="dimmed" ta="center" py="xl">
              Уведомлений нет
            </Text>
          </Table.Td>
        </Table.Tr>
      ) : (
        items.map((item) => {
          const status = getEffectiveStatus(item);
          return (
            <Table.Tr key={item.id} className={listPageStyles.row}>
              <Table.Td className={listPageStyles.bodyCell}>
                <Badge size="sm" variant="light">
                  {NOTIFICATION_TYPE_LABELS[item.type] ?? item.type}
                </Badge>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={500} c="#484848">
                  {item.title ?? '—'}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="rgba(72,72,72,0.4)" lineClamp={2}>
                  {item.body}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Tooltip
                  label={item.notes}
                  disabled={!item.notes}
                  multiline
                  maw={280}
                >
                  <Badge
                    size="sm"
                    variant="light"
                    color={status === 'read' ? 'green' : status === 'cancelled' ? 'red' : 'orange'}
                  >
                    {status === 'read' ? 'Прочитано' : status === 'cancelled' ? 'Отменено' : 'Новое'}
                  </Badge>
                </Tooltip>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="xs" c="rgba(72,72,72,0.4)">
                  {formatDateTime(item.scheduled_at)}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Group gap={4} wrap="nowrap">
                  {status === 'pending' && (
                    <>
                      <Tooltip label="Прочитано">
                        <ActionIcon
                          variant="subtle"
                          color="green"
                          size="sm"
                          onClick={() => onMarkRead(item.id)}
                        >
                          <CheckIcon size={14} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Отменить">
                        <ActionIcon
                          variant="subtle"
                          color="orange"
                          size="sm"
                          onClick={() => onCancel(item.id)}
                          loading={cancelPending}
                        >
                          <XIcon size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          );
        })
      )}
    </Table.Tbody>
  </Table>
);
