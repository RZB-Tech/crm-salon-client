import React from 'react';
import type { Appointment } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { AppointmentMobileCard } from './AppointmentMobileCard';
import { AppointmentsTable } from './AppointmentsTable';

interface AppointmentsListBodyProps extends TableSortProps {
  items: Appointment[];
  showArchived: boolean;
  canUpdate: boolean;
  restorePending: boolean;
  onRowClick: (appointment: Appointment) => void;
  onRestore: (event: React.MouseEvent, id: number) => void;
  onArchive: (event: React.MouseEvent, appointment: Appointment) => void;
}

export const AppointmentsListBody: React.FC<AppointmentsListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <AppointmentsTable {...props} />;
  }

  return (
    <ListCards isEmpty={props.items.length === 0} emptyMessage={t('appointments.notFound')}>
      {props.items.map((appointment) => (
        <AppointmentMobileCard
          key={appointment.id}
          appointment={appointment}
          showArchived={props.showArchived}
          canUpdate={props.canUpdate}
          restorePending={props.restorePending}
          onOpen={props.onRowClick}
          onRestore={props.onRestore}
          onArchive={props.onArchive}
        />
      ))}
    </ListCards>
  );
};
