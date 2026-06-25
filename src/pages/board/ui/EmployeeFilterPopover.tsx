import React from 'react';
import { Badge, Button, Checkbox, Group, Popover, Text, TextInput } from '@mantine/core';
import { MagnifyingGlass, Users } from '@phosphor-icons/react';
import type { Employee } from '@/shared/api/types';
import { getEmployeeFullName, getEmployeeInitials } from '@/shared/lib/format';
import { PersonAvatar } from '@/shared/ui/PersonAvatar';
import styles from './employee-filter-popover.module.css';

interface EmployeeFilterPopoverProps {
  employees: Employee[];
  selectedIds: Set<number>;
  onChange: (ids: Set<number>) => void;
  embedded?: boolean;
}

export const EmployeeFilterPopover: React.FC<EmployeeFilterPopoverProps> = ({
  employees,
  selectedIds,
  onChange,
  embedded = false
}) => {
  const [opened, setOpened] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filteredEmployees = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter((employee) =>
      getEmployeeFullName(employee).toLowerCase().includes(query)
    );
  }, [employees, search]);

  const handleToggle = React.useCallback(
    (id: number) => {
      const next = new Set(selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onChange(next);
    },
    [onChange, selectedIds]
  );

  const handleSelectAll = React.useCallback(() => {
    onChange(new Set(employees.map((employee) => employee.id)));
  }, [employees, onChange]);

  const handleReset = React.useCallback(() => {
    onChange(new Set());
    setSearch('');
  }, [onChange]);

  const buttonLabel = React.useMemo(() => {
    if (selectedIds.size === 0) return 'Сотрудники';
    return `Сотрудники (${selectedIds.size})`;
  }, [selectedIds.size]);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position='bottom-end'
      width={320}
      shadow='md'
      radius='md'
    >
      <Popover.Target>
        <Button
          variant={
            embedded
              ? selectedIds.size > 0
                ? 'light'
                : 'subtle'
              : selectedIds.size > 0
                ? 'light'
                : 'default'
          }
          color={selectedIds.size > 0 ? 'blue' : 'gray'}
          size='sm'
          leftSection={<Users size={16} />}
          rightSection={
            selectedIds.size > 0 ? (
              <Badge size='xs' variant='filled' circle>
                {selectedIds.size}
              </Badge>
            ) : undefined
          }
          onClick={() => setOpened((value) => !value)}
        >
          {buttonLabel}
        </Button>
      </Popover.Target>

      <Popover.Dropdown className={styles.employeeFilterPopover}>
        <TextInput
          className={styles.employeeFilterSearch}
          placeholder='Поиск сотрудника'
          leftSection={<MagnifyingGlass size={16} />}
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />

        <Group className={styles.employeeFilterActions}>
          <Button variant='subtle' size='xs' color='gray' onClick={handleSelectAll}>
            Выбрать всех
          </Button>
          <Button variant='subtle' size='xs' color='gray' onClick={handleReset}>
            Сбросить
          </Button>
        </Group>

        <div className={styles.employeeFilterList}>
          {filteredEmployees.length === 0 ? (
            <Text size='sm' c='dimmed' className={styles.employeeFilterEmpty}>
              Ничего не найдено
            </Text>
          ) : (
            filteredEmployees.map((employee) => {
              const checked = selectedIds.has(employee.id);
              const name = getEmployeeFullName(employee);
              return (
                <div
                  key={employee.id}
                  className={styles.employeeFilterRow}
                  onClick={() => handleToggle(employee.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleToggle(employee.id);
                    }
                  }}
                  role='checkbox'
                  aria-checked={checked}
                  tabIndex={0}
                >
                  <Checkbox
                    checked={checked}
                    onChange={() => handleToggle(employee.id)}
                    onClick={(event) => event.stopPropagation()}
                    aria-label={name}
                  />
                  <PersonAvatar
                    seed={employee.id}
                    initials={getEmployeeInitials(employee)}
                    size='xs'
                  />
                  <Text size='sm' lineClamp={1} className={styles.employeeFilterName}>
                    {name}
                  </Text>
                </div>
              );
            })
          )}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};
