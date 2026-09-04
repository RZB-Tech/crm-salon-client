import React from 'react';
import { ActionIcon, Badge, Group, Table, Text, Tooltip } from '@mantine/core';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import type { SalonNotification } from '@/shared/api/types';
import { listPageStyles, SortableTh } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { getEffectiveStatus, getSalonNotificationCopy } from '@/shared/lib/notifications/notificationDelivery';
import { formatDateTime, NOTIFICATION_TYPE_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';

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
}) => {
  const { t } = useI18n();
  const statusLabel = (status: string) =>
    status === 'read'
      ? t('notifications.markReadShort')
      : status === 'cancelled'
        ? t('notifications.cancelledItem')
        : t('notifications.newItem');

  return (
  <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
    <Table.Thead>
      <Table.Tr>
        <SortableTh column="type" sort={sort} onSort={onSort}>
          {t('form.type')}
        </SortableTh>
        <Table.Th className={listPageStyles.headCell}>{t('form.title')}</Table.Th>
        <Table.Th className={listPageStyles.headCell}>{t('form.body')}</Table.Th>
        <SortableTh column="status" sort={sort} onSort={onSort} w={140}>
          {t('common.status')}
        </SortableTh>
        <SortableTh column="scheduled" sort={sort} onSort={onSort} w={180}>
          {t('form.scheduled')}
        </SortableTh>
        <Table.Th className={listPageStyles.headCell} w={100} />
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {items.length === 0 ? (
        <Table.Tr>
          <Table.Td colSpan={6}>
            <Text size="sm" c="dimmed" ta="center" py="xl">
              {t('notifications.empty')}
            </Text>
          </Table.Td>
        </Table.Tr>
      ) : (
        items.map((item) => {
          const status = getEffectiveStatus(item);
          const copy = getSalonNotificationCopy(item);
          return (
            <Table.Tr key={item.id} className={listPageStyles.row}>
              <Table.Td className={listPageStyles.bodyCell}>
                <Badge size="sm" variant="light">
                  {NOTIFICATION_TYPE_LABELS[item.type] ?? item.type}
                </Badge>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={500} c="#484848">
                  {copy.title}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="rgba(72,72,72,0.4)" lineClamp={2}>
                  {copy.body || t('common.dash')}
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
                    {statusLabel(status)}
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
                      <Tooltip label={t('notifications.markReadShort')}>
                        <ActionIcon
                          variant="subtle"
                          color="green"
                          size="sm"
                          onClick={() => onMarkRead(item.id)}
                        >
                          <CheckIcon size={14} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={t('common.cancel')}>
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
};
