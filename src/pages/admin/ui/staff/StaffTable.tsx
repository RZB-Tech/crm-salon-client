import React from 'react';
import { Badge, Table, Text } from '@mantine/core';
import { listPageStyles, SortableTh } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import type { Staff } from '@/shared/api/types';

interface StaffTableProps extends TableSortProps {
  items: Staff[];
  onSelectStaff: (staff: Staff) => void;
}

export const StaffTable: React.FC<StaffTableProps> = ({ items, sort, onSort, onSelectStaff }) => {
  const { t } = useI18n();

  return (
    <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
      <Table.Thead>
        <Table.Tr>
          <SortableTh column="login" sort={sort} onSort={onSort}>
            {t('common.login')}
          </SortableTh>
          <SortableTh column="name" sort={sort} onSort={onSort}>
            {t('common.firstName')}
          </SortableTh>
          <Table.Th className={listPageStyles.headCell}>{t('admin.roles')}</Table.Th>
          <SortableTh column="status" sort={sort} onSort={onSort}>
            {t('common.status')}
          </SortableTh>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={4}>
              <Text size="sm" c="dimmed" ta="center" py="xl">
                {t('admin.emptyStaff')}
              </Text>
            </Table.Td>
          </Table.Tr>
        ) : (
          items.map((staff) => (
            <Table.Tr
              key={staff.id}
              className={`${listPageStyles.row} ${listPageStyles.rowClickable}`}
              onClick={() => onSelectStaff(staff)}
            >
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="#484848">
                  {staff.login}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="#484848">
                  {[staff.firstname, staff.lastname].filter(Boolean).join(' ') || t('common.dash')}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Badge
                  color={staff.roles.some((role) => role.name.toLowerCase().includes('admin')) ? 'violet' : 'blue'}
                  variant="light"
                  size="sm"
                >
                  {staff.roles.length > 0 ? staff.roles.map((role) => role.name).join(', ') : t('common.dash')}
                </Badge>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Badge color={staff.active ? 'green' : 'gray'} variant="dot" size="sm">
                  {staff.active ? t('form.staffActive') : t('form.staffInactive')}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
};
