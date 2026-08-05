import React from 'react';
import { Popover } from '@mantine/core';
import type { Employee } from '@/shared/api/types';
import { EmployeeFilterDropdown } from './EmployeeFilterDropdown';
import { EmployeeFilterTrigger } from './EmployeeFilterTrigger';

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
  embedded = false,
}) => {
  const [opened, setOpened] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const handleToggle = React.useCallback(
    (id: number) => {
      const next = new Set(selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onChange(next);
    },
    [onChange, selectedIds],
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
      position="bottom-end"
      width={320}
      shadow="md"
      radius="md"
    >
      <Popover.Target>
        <EmployeeFilterTrigger
          embedded={embedded}
          selectedCount={selectedIds.size}
          label={buttonLabel}
          onClick={() => setOpened((value) => !value)}
        />
      </Popover.Target>

      <Popover.Dropdown className={styles.employeeFilterPopover}>
        <EmployeeFilterDropdown
          employees={employees}
          selectedIds={selectedIds}
          search={search}
          onSearchChange={setSearch}
          onToggle={handleToggle}
          onSelectAll={handleSelectAll}
          onReset={handleReset}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
