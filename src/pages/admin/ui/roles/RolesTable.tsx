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
import { listPageStyles, SortableTh } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import type { Role } from '@/shared/api/types';

interface RolesTableProps extends TableSortProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onToggleArchive: (role: Role) => void;
}

export function RolesTable({ roles, sort, onSort, onEdit, onToggleArchive }: RolesTableProps) {
  const { t } = useI18n();
  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <SortableTh column="name" sort={sort} onSort={onSort}>
            {t('common.name')}
          </SortableTh>
          <Table.Th className={listPageStyles.headCell}>{t('form.description')}</Table.Th>
          <SortableTh column="permissions" sort={sort} onSort={onSort}>
            {t('admin.permissionsCount')}
          </SortableTh>
          <SortableTh column="status" sort={sort} onSort={onSort}>
            {t('common.status')}
          </SortableTh>
          <Table.Th className={listPageStyles.headCell} w={48} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {roles.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={5}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                {t('admin.emptyRoles')}
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
                  {r.description || t('common.dash')}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Badge variant="light">{r.permissions.length}</Badge>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                {r.archived ? (
                  <Badge color="gray" variant="light" size="sm">
                    {t('promotions.archived')}
                  </Badge>
                ) : (
                  <Badge color="green" variant="light" size="sm">
                    {t('admin.roleActive')}
                  </Badge>
                )}
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <ActionIcon
                  variant="subtle"
                  color={r.archived ? 'gray' : 'orange'}
                  size="sm"
                  aria-label={r.archived ? t('common.restore') : t('common.archive')}
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
