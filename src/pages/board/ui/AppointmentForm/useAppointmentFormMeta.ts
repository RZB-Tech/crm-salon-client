import React from 'react';
import type { Client, Promotion } from '@/shared/api/types';
import { getClientShortName } from '@/shared/lib/format';
import {
  calcServicesTotal,
  isAppointmentFormValid,
  type AppointmentFormValues,
} from '../../lib/appointmentForm';

interface UseAppointmentFormMetaParams {
  mode: 'create' | 'edit';
  values: AppointmentFormValues;
  clients: Client[];
  promotions: Promotion[];
  cancelled: boolean;
  archived: boolean;
  structureLocked: boolean;
}

export const useAppointmentFormMeta = ({
  mode,
  values,
  clients,
  promotions,
  cancelled,
  archived,
  structureLocked,
}: UseAppointmentFormMetaParams) => {
  const selectedClient = React.useMemo(
    () => clients.find((client) => String(client.id) === values.clientId),
    [clients, values.clientId],
  );

  const total = React.useMemo(
    () => calcServicesTotal(values.services, promotions),
    [values.services, promotions],
  );
  const isValid = isAppointmentFormValid(values);
  const fieldsLocked = cancelled || archived || structureLocked;

  const title =
    mode === 'create'
      ? 'Новая запись'
      : selectedClient
        ? getClientShortName(selectedClient)
        : 'Запись клиента';

  const subtitle = mode === 'create' ? undefined : 'Визит клиента';

  return { title, subtitle, total, isValid, fieldsLocked };
};
