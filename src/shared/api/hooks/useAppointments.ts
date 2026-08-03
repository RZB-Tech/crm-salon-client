import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiFetchAllPost,
  apiPatch,
  apiPost,
  apiRequest,
} from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Appointment,
  AppointmentCancelPayload,
  AppointmentCreatePayload,
  AppointmentUpdatePayload,
  ListFilters,
  Receipt,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

const normalizeAppointmentFilters = (
  filters?: ListFilters | boolean | null,
): ListFilters => {
  if (typeof filters === 'boolean') {
    return { archived: filters };
  }
  return {
    archived: false,
    ...(filters ?? {}),
  };
};

export const useAppointments = (filters?: ListFilters | boolean) => {
  const normalized = normalizeAppointmentFilters(filters);

  return useQuery({
    queryKey: [...queryKeys.appointments.all, normalized] as const,
    queryFn: () => apiFetchAllPost<Appointment>('/api/v1/appointments', normalized),
    staleTime: 1 * 60 * 1000,
  });
};

export const useAppointment = (id: number) =>
  useQuery({
    queryKey: queryKeys.appointments.detail(id),
    queryFn: () => apiRequest<Appointment>(`/api/v1/appointments/${id}`),
    enabled: id > 0,
  });

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentCreatePayload) =>
      apiPost<Appointment, AppointmentCreatePayload>('/api/v1/appointments', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
      addNotification.success({ message: 'Запись создана' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось создать запись' });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentCancelPayload) =>
      apiPatch<Appointment, AppointmentCancelPayload>('/api/v1/appointments/cancel', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(payload.id) });
      addNotification.success({ message: 'Запись отменена' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось отменить запись' });
    },
  });
};

export const useArchiveAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<Appointment, AppointmentUpdatePayload>('/api/v1/appointments', {
        id,
        archived: true,
      }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(result.id) });
      addNotification.success({ message: 'Запись архивирована' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось архивировать запись' });
    },
  });
};

export const useRestoreAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<Appointment, AppointmentUpdatePayload>('/api/v1/appointments', {
        id,
        archived: false,
      }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(result.id) });
      addNotification.success({ message: 'Запись восстановлена из архива' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось восстановить запись' });
    },
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentUpdatePayload) =>
      apiPatch<Appointment, AppointmentUpdatePayload>('/api/v1/appointments', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(payload.id) });
      addNotification.success({ message: 'Запись обновлена' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось обновить запись' });
    },
  });
};

export const useAppointmentReceipts = (appointmentId: number) =>
  useQuery({
    queryKey: [...queryKeys.appointments.detail(appointmentId), 'receipts'] as const,
    queryFn: () => apiRequest<Receipt[]>(`/api/v1/appointments/${appointmentId}/receipts`),
    enabled: appointmentId > 0,
  });
