import React from 'react';
import { ActionIcon, Badge, Group, Table, Text } from '@mantine/core';
import { PencilSimpleIcon, UserPlusIcon } from '@phosphor-icons/react';
import type { TenantBranch } from '@/shared/api/types';
import { formatDate } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { listPageStyles, SortableTh } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';

interface BranchesTableProps extends TableSortProps {
  items: TenantBranch[];
  onEdit: (branch: TenantBranch) => void;
  onAddAdmin: (branch: TenantBranch) => void;
}

export const BranchesTable: React.FC<BranchesTableProps> = ({
  items,
  sort,
  onSort,
  onEdit,
  onAddAdmin,
}) => {
  const { t } = useI18n();
  const { hasPermission } = useAccess();
  const canManage = hasPermission(PermissionCode.TENANT_BRANCH_MANAGE);
  const canCreate = hasPermission(PermissionCode.TENANT_BRANCH_CREATE);

  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <SortableTh column="name" sort={sort} onSort={onSort}>
            {t('form.branch')}
          </SortableTh>
          <SortableTh column="tin" sort={sort} onSort={onSort} w={160}>
            {t('branches.tin')}
          </SortableTh>
          <SortableTh column="status" sort={sort} onSort={onSort} w={120}>
            {t('common.status')}
          </SortableTh>
          <SortableTh column="created" sort={sort} onSort={onSort} w={140}>
            {t('branches.created')}
          </SortableTh>
          <Table.Th className={listPageStyles.headCell} w={96} />
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={5}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                {t('branches.empty')}
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          items.map((branch) => (
            <Table.Tr
              key={branch.id}
              className={`${listPageStyles.row} ${canManage ? listPageStyles.rowClickable : ''}`}
              onClick={canManage ? () => onEdit(branch) : undefined}
            >
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={600} c="#484848">
                  {branch.name}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="#484848">
                  {branch.TIN || t('common.dash')}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Badge variant="light" color={branch.active ? 'teal' : 'gray'} radius="sm">
                  {branch.active ? t('branches.active') : t('branches.inactive')}
                </Badge>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="#484848">
                  {formatDate(branch.created_at)}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Group gap={4} justify="flex-end" wrap="nowrap" onClick={(event) => event.stopPropagation()}>
                  {canCreate && (
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      aria-label={t('branches.addAdmin')}
                      onClick={() => onAddAdmin(branch)}
                    >
                      <UserPlusIcon size={16} />
                    </ActionIcon>
                  )}
                  {canManage && (
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      aria-label={t('common.edit')}
                      onClick={() => onEdit(branch)}
                    >
                      <PencilSimpleIcon size={16} />
                    </ActionIcon>
                  )}
                </Group>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
};
