import React from 'react';
import { ActionIcon, Badge, Table, Text } from '@mantine/core';
import { ArchiveIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Service, ServiceCategory } from '@/shared/api/types';
import { listPageStyles } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { formatDuration } from '../lib/formatDuration';
import styles from './services-page.module.css';

interface ServicesTableProps {
  items: Service[];
  categoryMap: Map<number, ServiceCategory>;
  showArchived: boolean;
  onEdit: (service: Service) => void;
  onArchive: (event: React.MouseEvent, serviceId: number) => void;
  onRestore: (event: React.MouseEvent, serviceId: number) => void;
}

export const ServicesTable: React.FC<ServicesTableProps> = ({
  items,
  categoryMap,
  showArchived,
  onEdit,
  onArchive,
  onRestore,
}) => {
  const { hasPermission } = useAccess();
  const canUpdate = !showArchived && hasPermission(PermissionCode.SERVICE_UPDATE);
  const canManage = hasPermission(PermissionCode.SERVICE_MANAGE);

  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className={listPageStyles.headCell}>Услуга</Table.Th>
          <Table.Th className={listPageStyles.headCell} w={275}>
            Длительность
          </Table.Th>
          <Table.Th className={listPageStyles.headCell} w={380}>
            Категория
          </Table.Th>
          <Table.Th className={listPageStyles.headCell} w={310}>
            Цена
          </Table.Th>
          <Table.Th className={listPageStyles.headCell} w={48} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={5}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                Услуги не найдены
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          items.map((service) => {
            const catLabel =
              service.category_id != null
                ? (categoryMap.get(service.category_id)?.name ?? null)
                : null;
            return (
              <Table.Tr
                key={service.id}
                className={`${listPageStyles.row} ${canUpdate ? listPageStyles.rowClickable : ''}`}
                onClick={canUpdate ? () => onEdit(service) : undefined}
              >
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={400} c="#484848">
                    {service.name}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                    {formatDuration(service.estimated_time)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  {catLabel ? (
                    <Badge size="sm" radius="xl" className={styles.categoryBadge}>
                      {catLabel}
                    </Badge>
                  ) : (
                    <Text size="sm" c="dimmed">
                      —
                    </Text>
                  )}
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={600} c="#484848">
                    {service.price > 0 ? formatPrice(service.price) : '—'}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  {canManage &&
                    (showArchived ? (
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        aria-label="Восстановить"
                        onClick={(e) => onRestore(e, service.id)}
                      >
                        <ArrowCounterClockwiseIcon size={18} />
                      </ActionIcon>
                    ) : (
                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        size="sm"
                        aria-label="Архивировать"
                        onClick={(e) => onArchive(e, service.id)}
                      >
                        <ArchiveIcon size={18} />
                      </ActionIcon>
                    ))}
                </Table.Td>
              </Table.Tr>
            );
          })
        )}
      </Table.Tbody>
    </Table>
  );
};
