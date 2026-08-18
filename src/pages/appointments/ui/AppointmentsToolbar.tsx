import React from 'react';
import { ActionIcon, Button, Group, UnstyledButton } from '@mantine/core';
import { ArchiveIcon, CaretLeftIcon, FunnelIcon, PlusIcon } from '@phosphor-icons/react';
import {
  isAppointmentDrawerFilterActive,
  type AppointmentFilterFormState,
} from '../lib/appointmentFilters';
import { AppointmentsFilterDrawer } from './AppointmentsFilterDrawer';
import styles from './appointments-toolbar.module.css';

interface AppointmentsToolbarProps {
  filterForm: AppointmentFilterFormState;
  patchFilter: (patch: Partial<AppointmentFilterFormState>) => void;
  hasFilterField: (field: string) => boolean;
  clientOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  canCreate: boolean;
  onCreateClick: () => void;
}

export const AppointmentsToolbar: React.FC<AppointmentsToolbarProps> = ({
  filterForm,
  patchFilter,
  hasFilterField,
  clientOptions,
  statusOptions,
  canCreate,
  onCreateClick,
}) => {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const filtersActive = isAppointmentDrawerFilterActive(filterForm);

  return (
    <>
      {filterForm.archived ? (
        <UnstyledButton
          className={styles.title}
          onClick={() => patchFilter({ archived: false })}
          aria-label="К посещениям"
        >
          <CaretLeftIcon size={16} />
          Архив
        </UnstyledButton>
      ) : (
        <h1 className={styles.title}>Посещения</h1>
      )}

      <Group gap={12} wrap="nowrap">
        <ActionIcon
          className={filtersActive ? styles.iconActive : undefined}
          variant="default"
          size={32}
          radius="md"
          aria-label="Фильтры"
          aria-pressed={filtersActive}
          onClick={() => setFiltersOpen(true)}
        >
          <FunnelIcon size={16} />
        </ActionIcon>
        {hasFilterField('archived') && (
          <ActionIcon
            className={filterForm.archived ? styles.iconActive : undefined}
            variant="default"
            size={32}
            radius="md"
            aria-label={filterForm.archived ? 'Показать активные' : 'Показать архив'}
            aria-pressed={filterForm.archived}
            onClick={() => patchFilter({ archived: !filterForm.archived })}
          >
            <ArchiveIcon size={16} />
          </ActionIcon>
        )}
        {canCreate && (
          <Button
            color="sage"
            size="sm"
            radius="md"
            rightSection={<PlusIcon size={16} />}
            onClick={onCreateClick}
          >
            Новая запись
          </Button>
        )}
      </Group>

      <AppointmentsFilterDrawer
        opened={filtersOpen}
        filterForm={filterForm}
        clientOptions={clientOptions}
        statusOptions={statusOptions}
        hasFilterField={hasFilterField}
        onClose={() => setFiltersOpen(false)}
        onApply={(draft) =>
          patchFilter({
            clientId: draft.clientId,
            status: draft.status,
            paid: draft.paid,
            dateFrom: draft.dateFrom,
            dateTo: draft.dateTo,
          })
        }
      />
    </>
  );
};
