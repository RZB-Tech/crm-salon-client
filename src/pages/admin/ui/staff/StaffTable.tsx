import React from 'react';
import { Badge, Box, Table, Text } from '@mantine/core';
import { ListPanelBody, ListPaginationFooter, listPageStyles, SortableTh } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useTableSort } from '@/shared/lib/hooks/useTableSort';
import type { Staff } from '@/shared/api/types';

interface StaffTableProps {
  staffList: Staff[];
  onSelectStaff: (staff: Staff) => void;
}

const STAFF_SORT_GETTERS = {
  login: (item: Staff) => item.login,
  name: (item: Staff) => [item.firstname, item.lastname].filter(Boolean).join(' '),
  status: (item: Staff) => Number(item.active),
};

export function StaffTable({ staffList, onSelectStaff }: StaffTableProps) {
  const { sort, sortedItems, toggleSort } = useTableSort(staffList, STAFF_SORT_GETTERS, {
    key: 'login',
    dir: 'asc',
  });
  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } = usePagination(
    sortedItems,
    {
      defaultPageSize: 20,
    },
  );

  React.useEffect(() => {
    resetPage();
  }, [sort.key, sort.dir, resetPage]);

  return (
    <Box className={listPageStyles.panel}>
      <ListPanelBody>
        <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
          <Table.Thead>
            <Table.Tr>
              <SortableTh column="login" sort={sort} onSort={toggleSort}>
                Логин
              </SortableTh>
              <SortableTh column="name" sort={sort} onSort={toggleSort}>
                Имя
              </SortableTh>
              <Table.Th className={listPageStyles.headCell}>Роли</Table.Th>
              <SortableTh column="status" sort={sort} onSort={toggleSort}>
                Статус
              </SortableTh>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedItems.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <Text size="sm" c="dimmed" ta="center" py="xl">
                    Нет пользователей
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedItems.map((s) => (
                <Table.Tr
                  key={s.id}
                  className={`${listPageStyles.row} ${listPageStyles.rowClickable}`}
                  onClick={() => onSelectStaff(s)}
                >
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" c="#484848">
                      {s.login}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" c="#484848">
                      {[s.firstname, s.lastname].filter(Boolean).join(' ') || '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Badge
                      color={s.roles.some((r) => r.name.toLowerCase().includes('admin')) ? 'violet' : 'blue'}
                      variant="light"
                      size="sm"
                    >
                      {s.roles.length > 0 ? s.roles.map((r) => r.name).join(', ') : '—'}
                    </Badge>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Badge color={s.active ? 'green' : 'gray'} variant="dot" size="sm">
                      {s.active ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </ListPanelBody>

      <ListPaginationFooter
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Box>
  );
}
