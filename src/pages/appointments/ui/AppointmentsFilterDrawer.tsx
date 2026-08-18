import React from 'react';
import { Group, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { FilterDrawer, FilterDrawerFooter } from '@/shared/ui';
import {
  emptyAppointmentFilterForm,
  type AppointmentFilterFormState,
} from '../lib/appointmentFilters';
import { PAID_OPTIONS } from '../lib/appointmentStatus';

interface AppointmentsFilterDrawerProps {
  opened: boolean;
  filterForm: AppointmentFilterFormState;
  clientOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  hasFilterField: (field: string) => boolean;
  onClose: () => void;
  onApply: (draft: AppointmentFilterFormState) => void;
}

export const AppointmentsFilterDrawer: React.FC<AppointmentsFilterDrawerProps> = ({
  opened,
  filterForm,
  clientOptions,
  statusOptions,
  hasFilterField,
  onClose,
  onApply,
}) => {
  const [draft, setDraft] = React.useState(filterForm);

  React.useEffect(() => {
    if (opened) setDraft(filterForm);
  }, [opened, filterForm]);

  const patchDraft = (patch: Partial<AppointmentFilterFormState>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  return (
    <FilterDrawer
      opened={opened}
      onClose={onClose}
      footer={
        <FilterDrawerFooter
          onReset={() =>
            setDraft({ ...emptyAppointmentFilterForm(), archived: filterForm.archived })
          }
          onApply={() => {
            onApply(draft);
            onClose();
          }}
        />
      }
    >
      {hasFilterField('client_id') && (
        <Select
          placeholder="Клиент"
          searchable
          clearable
          data={clientOptions}
          value={draft.clientId}
          onChange={(value) => patchDraft({ clientId: value })}
          size="md"
        />
      )}
      {hasFilterField('status') && (
        <Select
          placeholder="Статус"
          clearable
          data={statusOptions}
          value={draft.status}
          onChange={(value) => patchDraft({ status: value })}
          size="md"
        />
      )}
      {hasFilterField('paid') && (
        <Select
          placeholder="Оплата"
          clearable
          data={PAID_OPTIONS}
          value={draft.paid}
          onChange={(value) => patchDraft({ paid: value })}
          size="md"
        />
      )}
      {hasFilterField('start_time_est') && (
        <Group grow gap={12} align="flex-end">
          <DateInput
            placeholder="Период с"
            clearable
            value={draft.dateFrom || null}
            onChange={(value) => patchDraft({ dateFrom: value ?? '' })}
            size="md"
          />
          <DateInput
            placeholder="Период по"
            clearable
            value={draft.dateTo || null}
            onChange={(value) => patchDraft({ dateTo: value ?? '' })}
            size="md"
          />
        </Group>
      )}
    </FilterDrawer>
  );
};
