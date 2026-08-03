import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/query-keys';

/** Инвалидация списков/карточки записи и вложенных чеков. */
export const invalidateAppointments = (
  queryClient: QueryClient,
  appointmentId?: number | null,
) => {
  const tasks = [
    queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all }),
  ];

  if (appointmentId != null && appointmentId > 0) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.detail(appointmentId),
      }),
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.appointments.detail(appointmentId), 'receipts'],
      }),
    );
  }

  return Promise.all(tasks);
};

/** После изменений записи — связанные клиенты / сотрудники / аудит. */
export const invalidateAppointmentRelations = (
  queryClient: QueryClient,
  opts?: {
    appointmentId?: number | null;
    clientId?: number | null;
    employeeId?: number | null;
  },
) => {
  const tasks = [
    invalidateAppointments(queryClient, opts?.appointmentId),
    queryClient.invalidateQueries({ queryKey: queryKeys.clients.all }),
    queryClient.invalidateQueries({ queryKey: ['audit-logs'] }),
  ];

  if (opts?.clientId != null && opts.clientId > 0) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.detail(opts.clientId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.clients.appointments(opts.clientId),
      }),
    );
  }

  if (opts?.employeeId != null && opts.employeeId > 0) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees.appointments(opts.employeeId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees.detail(opts.employeeId),
      }),
    );
  }

  return Promise.all(tasks);
};

/** Оплата / чек — финансы + запись. */
export const invalidatePaymentFlow = (
  queryClient: QueryClient,
  appointmentId?: number | null,
) =>
  Promise.all([
    invalidateAppointments(queryClient, appointmentId),
    queryClient.invalidateQueries({ queryKey: queryKeys.receipts.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.clients.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.materials.all }),
    queryClient.invalidateQueries({ queryKey: ['audit-logs'] }),
  ]);

/** График сотрудника + доска назначений. */
export const invalidateEmployeeSchedule = (
  queryClient: QueryClient,
  employeeId?: number | null,
) => {
  const tasks = [
    queryClient.invalidateQueries({ queryKey: queryKeys.workSchedules.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.employees.all }),
    queryClient.invalidateQueries({ queryKey: ['assigned-employees'] }),
    queryClient.invalidateQueries({ queryKey: queryKeys.absences.all }),
  ];

  if (employeeId != null && employeeId > 0) {
    tasks.push(
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees.workSchedules(employeeId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees.detail(employeeId),
      }),
    );
  }

  return Promise.all(tasks);
};
