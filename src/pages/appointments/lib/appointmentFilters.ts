import type { FilterFieldSchema, ListFilters } from '@/shared/api/types';
import {
  APPOINTMENT_STATUS_LABELS,
  getClientFullName,
} from '@/shared/lib/format';
import type { Client } from '@/shared/api/types';

export const APPOINTMENT_FILTER_LABELS: Record<string, string> = {
  client_id: 'Клиент',
  start_time_est: 'Период с',
  end_time_est: 'Период по',
  status: 'Статус',
  paid: 'Оплата',
  archived: 'Архив',
};

export interface AppointmentFilterFormState {
  clientId: string | null;
  status: string | null;
  paid: string | null;
  dateFrom: string;
  dateTo: string;
  archived: boolean;
}

export const emptyAppointmentFilterForm = (): AppointmentFilterFormState => ({
  clientId: null,
  status: null,
  paid: null,
  dateFrom: '',
  dateTo: '',
  archived: false,
});

/** Собирает filters для POST /appointments/get-all по схеме бэкенда */
export const buildAppointmentListFilters = (
  form: AppointmentFilterFormState,
): ListFilters => {
  const filters: ListFilters = {
    archived: form.archived,
  };

  if (form.clientId) {
    filters.client_id = Number(form.clientId);
  }

  if (form.status) {
    filters.status = form.status;
  }

  if (form.paid === 'true') {
    filters.paid = true;
  } else if (form.paid === 'false') {
    filters.paid = false;
  }

  // Диапазон по start_time_est через операторы gte/lte (см. model_filter.py)
  if (form.dateFrom || form.dateTo) {
    const range: { gte?: string; lte?: string } = {};
    if (form.dateFrom) range.gte = `${form.dateFrom}T00:00:00`;
    if (form.dateTo) range.lte = `${form.dateTo}T23:59:59`;
    filters.start_time_est = range;
  }

  return filters;
};

export const enumOptionsFromSchema = (
  field: FilterFieldSchema | undefined,
  labels: Record<string, string> = APPOINTMENT_STATUS_LABELS,
): { value: string; label: string }[] =>
  (field?.options ?? []).map((value) => ({
    value,
    label: labels[value] ?? value,
  }));

export const clientFilterOptions = (clients: Client[]) =>
  clients.map((client) => ({
    value: String(client.id),
    label: getClientFullName(client),
  }));
