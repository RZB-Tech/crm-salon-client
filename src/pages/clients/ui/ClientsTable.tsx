import React from 'react';
import { ActionIcon, Avatar, Box, Group, Table, Text } from '@mantine/core';
import { ArchiveIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Client } from '@/shared/api/types';
import { listPageStyles } from '@/shared/ui';
import {
  formatDate,
  formatPrice,
  getClientFullName,
  getClientInitials,
  SEX_LABELS,
} from '@/shared/lib/format';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';

interface ClientsTableProps {
  items: Client[];
  showArchived: boolean;
  onRowClick: (client: Client) => void;
  onArchive: (event: React.MouseEvent, clientId: number) => void;
  onRestore: (event: React.MouseEvent, clientId: number) => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
  items,
  showArchived,
  onRowClick,
  onArchive,
  onRestore,
}) => {
  const { hasPermission } = useAccess();
  const canManage = hasPermission(PermissionCode.CLIENT_MANAGE);

  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className={listPageStyles.headCell} miw={220}>
            Клиенты
          </Table.Th>
          <Table.Th className={listPageStyles.headCell} w={160}>
            Телефон
          </Table.Th>
          <Table.Th className={listPageStyles.headCell} w={110}>
            Пол
          </Table.Th>
          <Table.Th className={listPageStyles.headCell} w={140}>
            Депозит
          </Table.Th>
          <Table.Th className={listPageStyles.headCell} w={130}>
            Дата рождения
          </Table.Th>
          <Table.Th className={listPageStyles.headCell} w={48} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={6}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                Клиенты не найдены
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          items.map((client) => (
            <Table.Tr
              key={client.id}
              className={`${listPageStyles.row} ${!showArchived ? listPageStyles.rowClickable : ''}`}
              onClick={!showArchived ? () => onRowClick(client) : undefined}
            >
              <Table.Td className={listPageStyles.bodyCell}>
                <Group gap={8} wrap="nowrap" maw="100%">
                  <Avatar radius="md" size={32} color="sage" style={{ flex: '0 0 auto' }}>
                    {getClientInitials(client)}
                  </Avatar>
                  <Box style={{ minWidth: 0, flex: 1 }}>
                    <Text size="sm" fw={400} lh="24px" c="#484848" lineClamp={1}>
                      {getClientFullName(client)}
                    </Text>
                    <Text size="xs" lh="12px" c="rgba(72,72,72,0.4)">
                      Клиент
                    </Text>
                  </Box>
                </Group>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                  {client.phone ?? '—'}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                  {SEX_LABELS[client.sex]}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={600} c="#484848">
                  {formatPrice(client.deposit)}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                  {formatDate(client.birth_date)}
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
                      onClick={(e) => onRestore(e, client.id)}
                    >
                      <ArrowCounterClockwiseIcon size={18} />
                    </ActionIcon>
                  ) : (
                    <ActionIcon
                      variant="subtle"
                      color="orange"
                      size="sm"
                      aria-label="Архивировать"
                      onClick={(e) => onArchive(e, client.id)}
                    >
                      <ArchiveIcon size={18} />
                    </ActionIcon>
                  ))}
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
};
