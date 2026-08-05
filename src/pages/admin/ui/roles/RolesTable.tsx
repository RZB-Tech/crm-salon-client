import {
  ActionIcon,
  Badge,
  Table,
  Text,
} from '@mantine/core';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
} from '@phosphor-icons/react';
import { listPageStyles } from '@/shared/ui';
import type { Role } from '@/shared/api/types';

interface RolesTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onToggleArchive: (role: Role) => void;
}

export function RolesTable({ roles, onEdit, onToggleArchive }: RolesTableProps) {
  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className={listPageStyles.headCell}>Название</Table.Th>
          <Table.Th className={listPageStyles.headCell}>Описание</Table.Th>
          <Table.Th className={listPageStyles.headCell}>Разрешений</Table.Th>
          <Table.Th className={listPageStyles.headCell}>Статус</Table.Th>
          <Table.Th className={listPageStyles.headCell} w={48} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {roles.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={5}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                Нет ролей
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          roles.map((r) => (
            <Table.Tr
              key={r.id}
              className={`${listPageStyles.row} ${listPageStyles.rowClickable}${r.archived ? ` ${listPageStyles.mutedRow}` : ''}`}
              onClick={() => onEdit(r)}
            >
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c={r.archived ? 'dimmed' : '#484848'}>
                  {r.name}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="rgba(72,72,72,0.4)">
                  {r.description || '—'}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Badge variant="light">{r.permissions.length}</Badge>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                {r.archived ? (
                  <Badge color="gray" variant="light" size="sm">
                    Архив
                  </Badge>
                ) : (
                  <Badge color="green" variant="light" size="sm">
                    Активна
                  </Badge>
                )}
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <ActionIcon
                  variant="subtle"
                  color={r.archived ? 'gray' : 'orange'}
                  size="sm"
                  aria-label={r.archived ? 'Восстановить' : 'Архивировать'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleArchive(r);
                  }}
                >
                  {r.archived ? (
                    <ArrowCounterClockwiseIcon size={16} />
                  ) : (
                    <ArchiveIcon size={16} />
                  )}
                </ActionIcon>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
}
