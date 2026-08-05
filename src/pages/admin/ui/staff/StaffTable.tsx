import { Badge, Box, Table, Text } from '@mantine/core';
import { ListPanelBody, ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import type { Staff } from '@/shared/api/types';

interface StaffTableProps {
  staffList: Staff[];
  onSelectStaff: (staff: Staff) => void;
}

export function StaffTable({ staffList, onSelectStaff }: StaffTableProps) {
  const { page, pageSize, paginatedItems, total, setPage, setPageSize } = usePagination(staffList, {
    defaultPageSize: 20,
  });

  return (
    <Box className={listPageStyles.panel}>
      <ListPanelBody>
        <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={listPageStyles.headCell}>Логин</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Имя</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Роли</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Статус</Table.Th>
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
