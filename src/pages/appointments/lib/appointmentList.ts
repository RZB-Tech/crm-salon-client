import type { Appointment } from '@/shared/api/types';
import {
  formatPrice,
  getClientFullName,
  parseApiDateFromDateTime,
  parseApiTimeFromDateTime,
} from '@/shared/lib/format';

export const getAppointmentClientId = (appointment: Appointment): number =>
  appointment.client_id ?? appointment.client?.id ?? 0;

export const getAppointmentClientName = (appointment: Appointment): string => {
  if (appointment.client) {
    return getClientFullName(appointment.client);
  }
  const id = getAppointmentClientId(appointment);
  return id ? `Клиент #${id}` : '—';
};

export const getAppointmentEmployeesLabel = (appointment: Appointment): string => {
  const names = (appointment.records ?? []).map((record) => {
    if (record.employee) {
      return [record.employee.firstname, record.employee.lastname].filter(Boolean).join(' ');
    }
    return `Сотрудник #${record.employee_id}`;
  });
  return names.length > 0 ? names.join(', ') : '—';
};

export const getAppointmentServicesLabel = (appointment: Appointment): string => {
  const lines = (appointment.records ?? []).flatMap((record) =>
    (record.services ?? []).map((service) => {
      const name =
        service.service?.name ??
        (service.material_id != null ? `Товар #${service.material_id}` : `Позиция #${service.id}`);
      const qty = service.quantity > 1 ? ` ×${service.quantity}` : '';
      return `${name}${qty} (${formatPrice(service.price)})`;
    }),
  );
  return lines.length > 0 ? lines.join('; ') : '—';
};

export const getAppointmentWhenLabel = (appointment: Appointment): string => {
  const date = parseApiDateFromDateTime(appointment.start_time_est);
  const start = parseApiTimeFromDateTime(appointment.start_time_est);
  const end = parseApiTimeFromDateTime(appointment.end_time_est);
  const [year, month, day] = date.split('-').map(Number);
  const local = new Date(year, month - 1, day);
  const dateLabel = local.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return `${dateLabel}, ${start}–${end}`;
};

export const matchesAppointmentSearch = (appointment: Appointment, query: string): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    String(appointment.id),
    getAppointmentClientName(appointment),
    appointment.client?.phone ?? '',
    getAppointmentEmployeesLabel(appointment),
    getAppointmentServicesLabel(appointment),
    appointment.notes ?? '',
    appointment.cancelled_reason ?? '',
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
};
