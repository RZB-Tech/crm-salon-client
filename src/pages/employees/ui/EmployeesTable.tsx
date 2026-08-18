import React from 'react';
import { ActionIcon, Avatar, Badge, Box, Group, Table, Text } from '@mantine/core';
import { ArchiveIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Employee } from '@/shared/api/types';
import { listPageStyles, SortableTh } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { formatPrice, getEmployeeFullName, getEmployeeInitials } from '@/shared/lib/format';

export interface EmployeesTableProps extends TableSortProps {
  employees: Employee[];
  specializationMap: Map<number, string>;
  showArchived: boolean;
  canManage: boolean;
  onOpen: (employee: Employee) => void;
  onArchive: (employee: Employee) => void;
  onRestore: (employee: Employee) => void;
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({
  employees,
  specializationMap,
  sort,
  onSort,
  showArchived,
  canManage,
  onOpen,
  onArchive,
  onRestore,
}) => (
  <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
    <Table.Thead>
      <Table.Tr>
        <SortableTh column="name" sort={sort} onSort={onSort}>
          Сотрудник
        </SortableTh>
        <SortableTh column="spec" sort={sort} onSort={onSort}>
          Специализация
        </SortableTh>
        <Table.Th className={listPageStyles.headCell} w={120}>
          Услуги
        </Table.Th>
        <SortableTh column="salary" sort={sort} onSort={onSort} w={180}>
          Ставка
        </SortableTh>
        <SortableTh column="status" sort={sort} onSort={onSort} w={120}>
          Статус
        </SortableTh>
        <Table.Th className={listPageStyles.headCell} w={48} />
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
      {employees.length === 0 ? (
        <Table.Tr>
          <Table.Td colSpan={6}>
            <Text size="sm" c="dimmed" ta="center" py="xl">
              Сотрудники не найдены
            </Text>
          </Table.Td>
        </Table.Tr>
      ) : (
        employees.map((employee) => {
          const specializationName =
            employee.specialization_id != null
              ? (specializationMap.get(employee.specialization_id) ?? null)
              : null;
          return (
            <Table.Tr
              key={employee.id}
              className={`${listPageStyles.row} ${listPageStyles.rowClickable}`}
              onClick={() => onOpen(employee)}
            >
              <Table.Td className={listPageStyles.bodyCell}>
                <Group gap={8} wrap="nowrap">
                  <Avatar radius="md" size={32} color="sage">
                    {getEmployeeInitials(employee)}
                  </Avatar>
                  <Box>
                    <Text size="sm" fw={400} c="#484848">
                      {getEmployeeFullName(employee)}
                    </Text>
                    <Text size="xs" c="rgba(72,72,72,0.4)">
                      {employee.phone ?? '—'}
                    </Text>
                  </Box>
                </Group>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="rgba(72,72,72,0.4)">
                  {specializationName ?? '—'}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" c="rgba(72,72,72,0.4)">
                  {employee.services?.length ?? 0}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Text size="sm" fw={600} c="#484848">
                  {employee.salary_fixed > 0 ? formatPrice(employee.salary_fixed) : '—'}
                </Text>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                <Badge color={employee.active ? 'green' : 'gray'} variant="light" size="sm">
                  {employee.active ? 'Активен' : 'Неактивен'}
                </Badge>
              </Table.Td>
              <Table.Td className={listPageStyles.bodyCell}>
                {canManage &&
                  (showArchived ? (
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      size="sm"
                      aria-label="Восстановить"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestore(employee);
                      }}
                    >
                      <ArrowCounterClockwiseIcon size={18} />
                    </ActionIcon>
                  ) : (
                    <ActionIcon
                      variant="subtle"
                      color="orange"
                      size="sm"
                      aria-label="Архивировать"
                      onClick={(e) => {
                        e.stopPropagation();
                        onArchive(employee);
                      }}
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
