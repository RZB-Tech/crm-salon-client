import React from 'react';
import { Box, SimpleGrid, Text } from '@mantine/core';
import type { Employee } from '@/shared/api/types';
import { EmployeeCard } from './EmployeeCard';
import { EmployeesTable } from './EmployeesTable';
import type { ListViewMode } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import styles from './employees-page.module.css';

export interface EmployeesListBodyProps extends TableSortProps {
  view: ListViewMode;
  employees: Employee[];
  specializationMap: Map<number, string>;
  showArchived: boolean;
  canManage: boolean;
  onOpen: (employee: Employee) => void;
  onArchive: (employeeId: number) => void;
  onRestore: (employeeId: number) => void;
}

export const EmployeesListBody: React.FC<EmployeesListBodyProps> = ({
  view,
  employees,
  specializationMap,
  sort,
  onSort,
  showArchived,
  canManage,
  onOpen,
  onArchive,
  onRestore,
}) => {
  const { t } = useI18n();
  if (view === 'cards') {
    return (
      <Box className={styles.cardsArea}>
        {employees.length === 0 ? (
          <Text size="sm" c="dimmed" ta="center" py="xl">
            {t('employees.notFound')}
          </Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                specializationName={
                  employee.specialization_id != null
                    ? (specializationMap.get(employee.specialization_id) ?? null)
                    : null
                }
                showArchived={showArchived}
                canManage={canManage}
                onOpen={onOpen}
                onDelete={(e) => onArchive(e.id)}
                onRestore={(e) => onRestore(e.id)}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>
    );
  }

  return (
    <EmployeesTable
      employees={employees}
      specializationMap={specializationMap}
      sort={sort}
      onSort={onSort}
      showArchived={showArchived}
      canManage={canManage}
      onOpen={onOpen}
      onArchive={(e) => onArchive(e.id)}
      onRestore={(e) => onRestore(e.id)}
    />
  );
};
