import React from 'react';
import { Avatar, Box, Button, Checkbox, Group, ScrollArea, Text, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import type { Employee } from '@/shared/api/types';
import { getEmployeeFullName, getEmployeeInitials } from '@/shared/lib/format';

import styles from './employee-filter-popover.module.css';

interface EmployeeFilterDropdownProps {
  employees: Employee[];
  selectedIds: Set<number>;
  search: string;
  onSearchChange: (value: string) => void;
  onToggle: (id: number) => void;
  onSelectAll: () => void;
  onReset: () => void;
}

export const EmployeeFilterDropdown: React.FC<EmployeeFilterDropdownProps> = ({
  employees,
  selectedIds,
  search,
  onSearchChange,
  onToggle,
  onSelectAll,
  onReset,
}) => {
  const filteredEmployees = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter((employee) =>
      getEmployeeFullName(employee).toLowerCase().includes(query),
    );
  }, [employees, search]);

  return (
    <>
      <TextInput
        className={styles.employeeFilterSearch}
        placeholder="Поиск сотрудника"
        leftSection={<MagnifyingGlassIcon size={16} />}
        value={search}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
      />

      <Group className={styles.employeeFilterActions}>
        <Button variant="subtle" size="xs" color="gray" onClick={onSelectAll}>
          Выбрать всех
        </Button>
        <Button variant="subtle" size="xs" color="gray" onClick={onReset}>
          Сбросить
        </Button>
      </Group>

      <ScrollArea.Autosize mah={320} offsetScrollbars>
        {filteredEmployees.length === 0 ? (
          <Text size="sm" c="dimmed" className={styles.employeeFilterEmpty}>
            Ничего не найдено
          </Text>
        ) : (
          filteredEmployees.map((employee) => {
            const checked = selectedIds.has(employee.id);
            const name = getEmployeeFullName(employee);
            return (
              <Box
                key={employee.id}
                className={styles.employeeFilterRow}
                onClick={() => onToggle(employee.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onToggle(employee.id);
                  }
                }}
                role="checkbox"
                aria-checked={checked}
                tabIndex={0}
              >
                <Checkbox
                  checked={checked}
                  onChange={() => onToggle(employee.id)}
                  onClick={(event) => event.stopPropagation()}
                  aria-label={name}
                />
                <Avatar radius="md" size="sm" color="sage">
                  {getEmployeeInitials(employee)}
                </Avatar>
                <Text size="sm" lineClamp={1} className={styles.employeeFilterName}>
                  {name}
                </Text>
              </Box>
            );
          })
        )}
      </ScrollArea.Autosize>
    </>
  );
};
