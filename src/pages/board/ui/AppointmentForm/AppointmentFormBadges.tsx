import React from 'react';
import { Badge } from '@mantine/core';
import type { Appointment } from '@/shared/api/types';
import { APPOINTMENT_CANCELLED_REASON_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';

export const AppointmentPaidBadge: React.FC<{ paid: boolean }> = ({ paid }) => {
  const { t } = useI18n();
  return (
  <Badge
    size="sm"
    variant="light"
    color={paid ? 'teal' : 'red'}
    tt="uppercase"
    radius="xl"
    styles={{
      root: paid
        ? undefined
        : { background: 'rgba(250, 82, 82, 0.1)', color: '#fa5252', textTransform: 'uppercase' },
    }}
  >
    {paid ? t('board.paidLower') : t('board.unpaidLower')}
  </Badge>
);
};

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
}) => {
  const { t } = useI18n();
  return (
  <>
    {archived && (
      <Badge color="gray" variant="light">
        {t('board.inArchive')}
      </Badge>
    )}
    {cancelled && (
      <Badge color="red" variant="light">
        {t('labels.appointmentStatus.cancelled')}
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
        {t('board.hasReceipt')}
      </Badge>
    )}
  </>
  );
};
