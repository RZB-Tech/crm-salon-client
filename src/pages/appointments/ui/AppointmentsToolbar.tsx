import React from 'react';
import { ActionIcon, Button, Group, UnstyledButton } from '@mantine/core';
import { ArchiveIcon, CaretLeftIcon, FunnelIcon, PlusIcon } from '@phosphor-icons/react';
import {
  isAppointmentDrawerFilterActive,
  type AppointmentFilterFormState,
} from '../lib/appointmentFilters';
import { AppointmentsFilterDrawer } from './AppointmentsFilterDrawer';
import { useI18n } from '@/shared/lib/i18n';
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
  const { t } = useI18n();
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const filtersActive = isAppointmentDrawerFilterActive(filterForm);

  return (
    <>
      {filterForm.archived ? (
        <UnstyledButton
          className={styles.title}
          onClick={() => patchFilter({ archived: false })}
          aria-label={t('appointments.toList')}
        >
          <CaretLeftIcon size={16} />
          {t('appointments.archiveTab')}
        </UnstyledButton>
      ) : (
        <h1 className={styles.title}>{t('appointments.title')}</h1>
      )}

      <Group gap={12} wrap="nowrap">
        <ActionIcon
          className={filtersActive ? styles.iconActive : undefined}
          variant="default"
          size={32}
          radius="md"
          aria-label={t('common.filters')}
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
            aria-label={filterForm.archived ? t('common.showActive') : t('common.showArchive')}
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
            {t('board.newAppointment')}
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
