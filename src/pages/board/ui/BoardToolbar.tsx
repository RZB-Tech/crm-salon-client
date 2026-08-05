import React from 'react';
import { Box, Button, Group } from '@mantine/core';
import { Plus } from '@phosphor-icons/react';
import type { Employee } from '@/shared/api/types';
import { ArchiveToggle } from '@/shared/ui';
import { EmployeeFilterPopover } from './EmployeeFilterPopover';
import styles from './board-page.module.css';

interface BoardToolbarProps {
  boardEmployees: Employee[];
  employeeFilter: Set<number>;
  onEmployeeFilterChange: (ids: Set<number>) => void;
  showArchived: boolean;
  onShowArchivedChange: (value: boolean) => void;
  canCreateAppointment: boolean;
  canOpenCreateForm: boolean;
  onCreateAppointment: () => void;
}

export const BoardToolbar: React.FC<BoardToolbarProps> = ({
  boardEmployees,
  employeeFilter,
  onEmployeeFilterChange,
  showArchived,
  onShowArchivedChange,
  canCreateAppointment,
  canOpenCreateForm,
  onCreateAppointment,
}) => (
  <Box className={styles.toolbar}>
    <Box className={styles.toolbarMain}>
      {boardEmployees.length > 0 && (
        <EmployeeFilterPopover
          employees={boardEmployees}
          selectedIds={employeeFilter}
          onChange={onEmployeeFilterChange}
          embedded
        />
      )}
    </Box>
    <Group gap={8} wrap="nowrap">
      {canCreateAppointment && (
        <Button
          leftSection={<Plus size={16} />}
          size="sm"
          onClick={onCreateAppointment}
          disabled={!canOpenCreateForm}
        >
          Новая запись
        </Button>
      )}
      <ArchiveToggle active={showArchived} onChange={onShowArchivedChange} />
    </Group>
  </Box>
);
