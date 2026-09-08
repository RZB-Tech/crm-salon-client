import React from 'react';
import { ActionIcon, Badge } from '@mantine/core';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  CurrencyCircleDollarIcon,
  PhoneIcon,
  ScissorsIcon,
  UserListIcon,
} from '@phosphor-icons/react';
import type { Appointment } from '@/shared/api/types';
import { ListEntityCard } from '@/shared/ui';
import { APPOINTMENT_STATUS_LABELS, formatDate, formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import {
  getAppointmentClientName,
  getAppointmentDateLabel,
  getAppointmentEmployeesLabel,
  getAppointmentPrimaryServiceName,
} from '../lib/appointmentList';
import { paidLabel } from '../lib/appointmentStatus';
import styles from './appointment-mobile-card.module.css';

interface AppointmentMobileCardProps {
  appointment: Appointment;
  showArchived: boolean;
  canUpdate: boolean;
  restorePending: boolean;
  onOpen: (appointment: Appointment) => void;
  onRestore: (event: React.MouseEvent, id: number) => void;
  onArchive: (event: React.MouseEvent, appointment: Appointment) => void;
}

export const AppointmentMobileCard: React.FC<AppointmentMobileCardProps> = ({
  appointment,
  showArchived,
  canUpdate,
  restorePending,
  onOpen,
  onRestore,
  onArchive,
}) => {
  const { t } = useI18n();
  const finished = appointment.status === 'finished';

  return (
    <ListEntityCard onClick={() => onOpen(appointment)}>
      <div className={styles.cardTop}>
        <div className={styles.chips}>
          <span className={`${styles.chip} ${styles.chipFilled}`}>№{appointment.id}</span>
          <span className={`${styles.chip} ${styles.chipOutline}`}>
            {getAppointmentDateLabel(appointment)}
          </span>
        </div>
        {canUpdate &&
          (showArchived || appointment.archived ? (
            <ActionIcon
              className={styles.archiveBtn}
              variant="subtle"
              color="teal"
              aria-label={t('common.restore')}
              loading={restorePending}
              onClick={(event) => {
                event.stopPropagation();
                onRestore(event, appointment.id);
              }}
            >
              <ArrowCounterClockwiseIcon size={16} />
            </ActionIcon>
          ) : (
            <ActionIcon
              className={styles.archiveBtn}
              variant="default"
              aria-label={t('common.archive')}
              onClick={(event) => {
                event.stopPropagation();
                onArchive(event, appointment);
              }}
            >
              <ArchiveIcon size={16} />
            </ActionIcon>
          ))}
      </div>

      <p className={styles.name}>{getAppointmentClientName(appointment)}</p>
      {appointment.client?.phone && (
        <div className={`${styles.meta} ${styles.metaMuted}`}>
          <PhoneIcon size={16} />
          {appointment.client.phone}
        </div>
      )}
      <div className={styles.meta}>
        <UserListIcon size={16} />
        {getAppointmentEmployeesLabel(appointment)}
      </div>
      <div className={styles.meta}>
        <ScissorsIcon size={16} />
        {getAppointmentPrimaryServiceName(appointment)}
      </div>
      <div className={styles.price}>
        <CurrencyCircleDollarIcon size={16} />
        {formatPrice(appointment.total_price)}
      </div>

      <div className={styles.footer}>
        <div className={styles.badges}>
          <Badge
            className={finished ? styles.statusBadge : undefined}
            size="sm"
            variant="light"
            color={finished ? 'teal' : appointment.status === 'cancelled' ? 'red' : 'gray'}
            radius="xl"
            tt="uppercase"
          >
            {APPOINTMENT_STATUS_LABELS[appointment.status] ?? appointment.status}
          </Badge>
          <Badge
            className={appointment.paid ? styles.statusBadge : undefined}
            size="sm"
            variant="light"
            color={appointment.paid ? 'teal' : 'red'}
            radius="xl"
            tt="uppercase"
          >
            {paidLabel(appointment.paid)}
          </Badge>
        </div>
        <span className={styles.created}>
          {t('appointments.created')}: {formatDate(appointment.created_at)}
        </span>
      </div>
    </ListEntityCard>
  );
};
