import React from 'react';
import { Button, Group, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { PlusIcon } from '@phosphor-icons/react';
import { ArchiveToggle } from '@/shared/ui';
import {
  APPOINTMENT_FILTER_LABELS,
  type AppointmentFilterFormState,
} from '../lib/appointmentFilters';
import { PAID_OPTIONS } from '../lib/appointmentStatus';

interface AppointmentsFiltersProps {
  filterForm: AppointmentFilterFormState;
  patchFilter: (patch: Partial<AppointmentFilterFormState>) => void;
  hasFilterField: (field: string) => boolean;
  clientOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  canCreate: boolean;
  onCreateClick: () => void;
}

export const AppointmentsFilters: React.FC<AppointmentsFiltersProps> = ({
  filterForm,
  patchFilter,
  hasFilterField,
  clientOptions,
  statusOptions,
  canCreate,
  onCreateClick,
}) => (
  <Group justify="space-between" w="100%" gap="sm" wrap="wrap" align="flex-end">
    <Group gap="sm" wrap="wrap" align="flex-end">
      {hasFilterField('client_id') && (
        <Select
          label={APPOINTMENT_FILTER_LABELS.client_id}
          placeholder="Все клиенты"
          searchable
          clearable
          data={clientOptions}
          value={filterForm.clientId}
          onChange={(value) => patchFilter({ clientId: value })}
          size="sm"
          w={200}
        />
      )}
      {hasFilterField('status') && (
        <Select
          label={APPOINTMENT_FILTER_LABELS.status}
          placeholder="Все статусы"
          clearable
          data={statusOptions}
          value={filterForm.status}
          onChange={(value) => patchFilter({ status: value })}
          size="sm"
          w={150}
        />
      )}
      {hasFilterField('paid') && (
        <Select
          label={APPOINTMENT_FILTER_LABELS.paid}
          placeholder="Все"
          clearable
          data={PAID_OPTIONS}
          value={filterForm.paid}
          onChange={(value) => patchFilter({ paid: value })}
          size="sm"
          w={140}
        />
      )}
      {hasFilterField('start_time_est') && (
        <>
          <DateInput
            label={APPOINTMENT_FILTER_LABELS.start_time_est}
            placeholder="От"
            clearable
            value={filterForm.dateFrom || null}
            onChange={(value) => patchFilter({ dateFrom: value ?? '' })}
            size="sm"
            w={150}
          />
          <DateInput
            label={APPOINTMENT_FILTER_LABELS.end_time_est}
            placeholder="До"
            clearable
            value={filterForm.dateTo || null}
            onChange={(value) => patchFilter({ dateTo: value ?? '' })}
            size="sm"
            w={150}
          />
        </>
      )}
    </Group>

    <Group gap={8} wrap="nowrap" align="flex-end">
      {!filterForm.archived && canCreate && (
        <Button
          color="sage.7"
          rightSection={<PlusIcon size={16} />}
          onClick={onCreateClick}
          size="sm"
        >
          Новая запись
        </Button>
      )}
      {hasFilterField('archived') && (
        <ArchiveToggle
          active={filterForm.archived}
          onChange={(archived) => patchFilter({ archived })}
        />
      )}
    </Group>
  </Group>
);
