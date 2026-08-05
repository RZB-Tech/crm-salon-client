import type { Appointment } from '@/shared/api/types';
import type { AppointmentFormValues } from './appointmentFormTypes';
import {
  getLineReason,
  isLineFilled,
  isPriceChanged,
} from './appointmentFormLineUtils';

export const isAppointmentFormValid = (values: AppointmentFormValues): boolean => {
  if (
    !values.clientId ||
    !values.employeeId ||
    !values.date ||
    values.startTime >= values.endTime ||
    !values.services.some(isLineFilled)
  ) {
    return false;
  }

  return values.services.every((line) => {
    if (!isLineFilled(line)) return true;
    // BUG-013: Проверка на отрицательные значения
    if (line.price <= 0 || line.quantity <= 0) return false;
    if (isPriceChanged(line) && getLineReason(line).length < 5) return false;
    return true;
  });
};

export const hasScheduleChanged = (
  appointment: Appointment,
  values: AppointmentFormValues,
): boolean => {
  const clientId = appointment.client_id ?? appointment.client?.id;
  const start = `${values.date}T${values.startTime}:00`;
  const end = `${values.date}T${values.endTime}:00`;
  const apiStart = appointment.start_time_est.replace('Z', '').slice(0, 19);
  const apiEnd = appointment.end_time_est.replace('Z', '').slice(0, 19);

  return Number(values.clientId) !== clientId || start !== apiStart || end !== apiEnd;
};
