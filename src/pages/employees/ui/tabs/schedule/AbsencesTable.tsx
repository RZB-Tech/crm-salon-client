import React from 'react';
import { ActionIcon, Badge, Box, Button, Table, Text } from '@mantine/core';
import { ArchiveIcon, Plus } from '@phosphor-icons/react';
import type { Absence } from '@/shared/api/types';
import { DataTable, DataTableRow } from '@/shared/ui';
import { ABSENCE_TYPE_LABELS, formatDate } from '@/shared/lib/format';
import profileStyles from '../../employee-profile.module.css';

export interface AbsencesTableProps {
  absences: Absence[];
  onAdd: () => void;
  onEdit: (absence: Absence) => void;
  onArchive: (absenceId: number) => void;
}

export const AbsencesTable: React.FC<AbsencesTableProps> = ({
  absences,
  onAdd,
  onEdit,
  onArchive,
}) => (
  <Box>
    <Box className={profileStyles.toolbar}>
      <Text fw={600}>Отсутствия</Text>
      <Button size="xs" variant="light" leftSection={<Plus size={14} />} onClick={onAdd}>
        Добавить
      </Button>
    </Box>
    <DataTable
      compact
      stickyHeader={false}
      maxHeight={300}
      columns={[
        { key: 'type', label: 'Тип' },
        { key: 'period', label: 'Период' },
        { key: 'reason', label: 'Причина' },
        { key: 'actions', label: '', width: 48 },
      ]}
      isEmpty={absences.length === 0}
      emptyMessage="Отсутствий нет"
    >
      {absences.map((absence) => (
        <DataTableRow key={absence.id} onClick={() => onEdit(absence)} style={{ cursor: 'pointer' }}>
          <Table.Td>
            <Badge variant="light" size="sm">
              {ABSENCE_TYPE_LABELS[absence.absence_type]}
            </Badge>
          </Table.Td>
          <Table.Td>
            {formatDate(absence.start_date)} — {formatDate(absence.end_date)}
          </Table.Td>
          <Table.Td>
            <Text size="sm" c="dimmed" lineClamp={1}>
              {absence.reason ?? '—'}
            </Text>
          </Table.Td>
          <Table.Td>
            <ActionIcon
              variant="subtle"
              color="orange"
              size="sm"
              aria-label="Архивировать"
              onClick={(e) => {
                e.stopPropagation();
                onArchive(absence.id);
              }}
            >
              <ArchiveIcon size={16} />
            </ActionIcon>
          </Table.Td>
        </DataTableRow>
      ))}
    </DataTable>
  </Box>
);
