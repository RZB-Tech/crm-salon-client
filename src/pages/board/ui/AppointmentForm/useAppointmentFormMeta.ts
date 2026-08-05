import React from 'react';
import type { Client } from '@/shared/api/types';
import { getClientFullName } from '@/shared/lib/format';
import {
  calcServicesTotal,
  isAppointmentFormValid,
  type AppointmentFormValues,
} from '../../lib/appointmentForm';

interface UseAppointmentFormMetaParams {
  mode: 'create' | 'edit';
  values: AppointmentFormValues;
  clients: Client[];
  cancelled: boolean;
  archived: boolean;
  structureLocked: boolean;
}

export const useAppointmentFormMeta = ({
  mode,
  values,
  clients,
  cancelled,
  archived,
  structureLocked,
}: UseAppointmentFormMetaParams) => {
  const selectedClient = React.useMemo(
    () => clients.find((client) => String(client.id) === values.clientId),
    [clients, values.clientId],
  );

  const total = React.useMemo(() => calcServicesTotal(values.services), [values.services]);
  const isValid = isAppointmentFormValid(values);
  const fieldsLocked = cancelled || archived || structureLocked;

  const title =
    mode === 'create'
      ? 'Новая запись'
      : selectedClient
        ? getClientFullName(selectedClient)
        : 'Запись клиента';

  const subtitle =
    mode === 'create'
      ? 'Клиент, время и состав визита'
      : [values.date, `${values.startTime}–${values.endTime}`].filter(Boolean).join(' · ');

  const avatarInitials = React.useMemo(() => {
    if (!selectedClient) return null;
    return (
      [selectedClient.firstname?.[0], selectedClient.lastname?.[0]]
        .filter(Boolean)
        .join('')
        .toUpperCase() || null
    );
  }, [selectedClient]);

  return { title, subtitle, avatarInitials, total, isValid, fieldsLocked };
};
