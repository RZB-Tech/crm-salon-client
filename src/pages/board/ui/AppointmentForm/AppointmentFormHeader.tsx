import React from 'react';
import { ActionIcon, Badge } from '@mantine/core';
import { CalendarPlus, CheckCircle, X } from '@phosphor-icons/react';
import type { Appointment } from '@/shared/api/types';
import { APPOINTMENT_CANCELLED_REASON_LABELS } from '@/shared/lib/format';
import styles from './appointment-form-modal.module.css';

interface AppointmentFormHeaderProps {
  mode: 'create' | 'edit';
  title: string;
  subtitle: string;
  avatarInitials: string | null;
  paid: boolean;
  archived: boolean;
  cancelled: boolean;
  structureLocked: boolean;
  appointment: Appointment | null;
  onClose: () => void;
}

export const AppointmentFormHeader: React.FC<AppointmentFormHeaderProps> = ({
  mode,
  title,
  subtitle,
  avatarInitials,
  paid,
  archived,
  cancelled,
  structureLocked,
  appointment,
  onClose,
}) => (
  <header className={styles.header}>
    <div className={styles.headerTop}>
      <div className={styles.headerAvatar}>
        {avatarInitials ?? <CalendarPlus size={22} />}
      </div>
      <div className={styles.headerInfo}>
        <h2 className={styles.headerTitle}>{title}</h2>
        <div className={styles.headerSubtitle}>{subtitle}</div>
      </div>
      <div className={styles.headerSide}>
        {mode === 'edit' && (
          <Badge
            size="lg"
            variant="light"
            color={paid ? 'teal' : 'orange'}
            leftSection={paid ? <CheckCircle size={14} /> : undefined}
          >
            {paid ? 'Оплачено' : 'Не оплачено'}
          </Badge>
        )}
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          radius="xl"
          aria-label="Закрыть"
          onClick={onClose}
        >
          <X size={18} />
        </ActionIcon>
      </div>
    </div>

    {mode === 'edit' && (archived || cancelled || structureLocked) && (
      <div className={styles.badgeRow}>
        {archived && (
          <Badge color="gray" variant="light">
            В архиве
          </Badge>
        )}
        {cancelled && (
          <Badge color="red" variant="light">
            Отменена
          </Badge>
        )}
        {cancelled && appointment?.cancelled_reason && (
          <Badge color="gray" variant="outline">
            {APPOINTMENT_CANCELLED_REASON_LABELS[appointment.cancelled_reason] ??
              appointment.cancelled_reason}
          </Badge>
        )}
        {structureLocked && (
          <Badge color="yellow" variant="light">
            Есть чек
          </Badge>
        )}
      </div>
    )}
  </header>
);
