import React from 'react';
import { ActionIcon, Button, Group, UnstyledButton } from '@mantine/core';
import { ArchiveIcon, FunnelIcon, PlusIcon } from '@phosphor-icons/react';
import { ListPageTitle, listPageStyles } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
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
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const filtersActive = isAppointmentDrawerFilterActive(filterForm);

  return (
    <>
      <ListPageTitle
        onBack={filterForm.archived ? () => patchFilter({ archived: false }) : undefined}
        backLabel={t('appointments.toList')}
      >
        {filterForm.archived ? t('appointments.archiveTab') : t('appointments.title')}
      </ListPageTitle>

      {isMobile ? (
        <div className={listPageStyles.toolbarRow}>
          <UnstyledButton
            className={`${styles.filterField}${filtersActive ? ` ${styles.filterFieldActive}` : ''}`}
            onClick={() => setFiltersOpen(true)}
          >
            <span>{t('appointments.filterPlaceholder')}</span>
            <FunnelIcon size={16} />
          </UnstyledButton>
          {hasFilterField('archived') && (
            <ActionIcon
              className={listPageStyles.archiveBtn}
              variant="default"
              size={40}
              radius={8}
              aria-label={filterForm.archived ? t('common.showActive') : t('common.showArchive')}
              aria-pressed={filterForm.archived}
              onClick={() => patchFilter({ archived: !filterForm.archived })}
            >
              <ArchiveIcon size={18} />
            </ActionIcon>
          )}
        </div>
      ) : (
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
      )}

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
