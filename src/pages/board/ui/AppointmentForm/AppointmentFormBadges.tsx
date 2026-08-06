import React from 'react';
import { Badge } from '@mantine/core';
import { CheckCircle } from '@phosphor-icons/react';
import type { Appointment } from '@/shared/api/types';
import { APPOINTMENT_CANCELLED_REASON_LABELS } from '@/shared/lib/format';

export const AppointmentPaidBadge: React.FC<{ paid: boolean }> = ({ paid }) => (
  <Badge
    size="lg"
    variant="light"
    color={paid ? 'teal' : 'orange'}
    leftSection={paid ? <CheckCircle size={14} /> : undefined}
  >
    {paid ? 'Оплачено' : 'Не оплачено'}
  </Badge>
);

interface AppointmentStateBadgesProps {
  archived: boolean;
  cancelled: boolean;
  structureLocked: boolean;
  appointment: Appointment | null;
}

export const AppointmentStateBadges: React.FC<AppointmentStateBadgesProps> = ({
  archived,
  cancelled,
  structureLocked,
  appointment,
}) => (
  <>
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
  </>
);
