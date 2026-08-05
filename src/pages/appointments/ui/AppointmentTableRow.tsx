import React from 'react';
import { ActionIcon, Badge, Stack, Table, Text, Tooltip } from '@mantine/core';
import { ArchiveIcon, ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Appointment } from '@/shared/api/types';
import { listPageStyles } from '@/shared/ui';
import {
  APPOINTMENT_CANCELLED_REASON_LABELS,
  APPOINTMENT_STATUS_LABELS,
  formatDateTime,
  formatPrice,
} from '@/shared/lib/format';
import {
  getAppointmentClientName,
  getAppointmentEmployeesLabel,
  getAppointmentServicesLabel,
  getAppointmentWhenLabel,
} from '../lib/appointmentList';
import { paidBadgeColor, paidLabel, statusColor } from '../lib/appointmentStatus';

interface AppointmentTableRowProps {
  appointment: Appointment;
  showArchived: boolean;
  canUpdate: boolean;
  restorePending: boolean;
  onRowClick: (appointment: Appointment) => void;
  onRestore: (event: React.MouseEvent, id: number) => void;
  onArchive: (event: React.MouseEvent, appointment: Appointment) => void;
}

export const AppointmentTableRow: React.FC<AppointmentTableRowProps> = ({
  appointment,
  showArchived,
  canUpdate,
  restorePending,
  onRowClick,
  onRestore,
  onArchive,
}) => (
  <Table.Tr
    className={`${listPageStyles.row} ${listPageStyles.rowClickable}`}
    onClick={() => onRowClick(appointment)}
  >
    <Table.Td className={listPageStyles.bodyCell}>
      <Text size="sm" c="dimmed">
        {appointment.id}
      </Text>
    </Table.Td>
    <Table.Td className={listPageStyles.bodyCell}>
      <Text size="sm" fw={600}>
        {getAppointmentWhenLabel(appointment)}
      </Text>
    </Table.Td>
    <Table.Td className={listPageStyles.bodyCell}>
      <Stack gap={2}>
        <Text size="sm" fw={500}>
          {getAppointmentClientName(appointment)}
        </Text>
        {appointment.client?.phone && (
          <Text size="xs" c="dimmed">
            {appointment.client.phone}
          </Text>
        )}
      </Stack>
    </Table.Td>
    <Table.Td className={listPageStyles.bodyCell}>
      <Text size="sm" lineClamp={2}>
        {getAppointmentEmployeesLabel(appointment)}
      </Text>
    </Table.Td>
    <Table.Td className={listPageStyles.bodyCell}>
      <Text size="sm" lineClamp={3}>
        {getAppointmentServicesLabel(appointment)}
      </Text>
    </Table.Td>
    <Table.Td className={listPageStyles.bodyCell}>
      <Text size="sm" fw={600}>
        {formatPrice(appointment.total_price)}
      </Text>
    </Table.Td>
    <Table.Td className={listPageStyles.bodyCell}>
      <Stack gap={4}>
        <Badge size="sm" variant="light" color={statusColor(appointment.status)}>
          {APPOINTMENT_STATUS_LABELS[appointment.status] ?? appointment.status}
        </Badge>
        {appointment.status === 'cancelled' && appointment.cancelled_reason && (
          <Text size="xs" c="dimmed" lineClamp={2}>
            {APPOINTMENT_CANCELLED_REASON_LABELS[appointment.cancelled_reason] ??
              appointment.cancelled_reason}
          </Text>
        )}
      </Stack>
    </Table.Td>
    <Table.Td className={listPageStyles.bodyCell}>
      <Badge size="sm" variant="light" color={paidBadgeColor(appointment.paid)}>
        {paidLabel(appointment.paid)}
      </Badge>
    </Table.Td>
    <Table.Td className={listPageStyles.bodyCell}>
      <Text size="sm" c={appointment.notes ? undefined : 'dimmed'} lineClamp={2}>
        {appointment.notes || '—'}
      </Text>
    </Table.Td>
    <Table.Td className={listPageStyles.bodyCell}>
      <Text size="xs" c="dimmed">
        {formatDateTime(appointment.created_at)}
      </Text>
    </Table.Td>
    <Table.Td className={listPageStyles.bodyCell} onClick={(event) => event.stopPropagation()}>
      {showArchived || appointment.archived
        ? canUpdate && (
            <Tooltip label="Восстановить">
              <ActionIcon
                variant="subtle"
                color="teal"
                onClick={(event) => onRestore(event, appointment.id)}
                loading={restorePending}
              >
                <ArrowCounterClockwiseIcon size={16} />
              </ActionIcon>
            </Tooltip>
          )
        : canUpdate && (
            <Tooltip label="Архивировать">
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={(event) => onArchive(event, appointment)}
              >
                <ArchiveIcon size={16} />
              </ActionIcon>
            </Tooltip>
          )}
    </Table.Td>
  </Table.Tr>
);
