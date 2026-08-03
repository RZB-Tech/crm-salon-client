import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiPatch, apiPost } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Appointment,
  AppointmentServiceCreatePayload,
  AppointmentServiceUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

const invalidateAppointment = (
  queryClient: ReturnType<typeof useQueryClient>,
  appointmentId?: number,
) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
  if (appointmentId) {
    queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(appointmentId) });
  }
};

export const useCreateAppointmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentServiceCreatePayload) =>
      apiPost<Appointment, AppointmentServiceCreatePayload>(
        '/api/v1/appointments-services',
        payload,
      ),
    onSuccess: (result) => {
      invalidateAppointment(queryClient, result.id);
      addNotification.success({ message: 'Позиция добавлена' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось добавить позицию' });
    },
  });
};

export const useUpdateAppointmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentServiceUpdatePayload) =>
      apiPatch<Appointment, AppointmentServiceUpdatePayload>(
        '/api/v1/appointments-services',
        payload,
      ),
    onSuccess: (result) => {
      invalidateAppointment(queryClient, result.id);
      addNotification.success({ message: 'Позиция обновлена' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось обновить позицию' });
    },
  });
};

export const useDeleteAppointmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiDelete<Appointment>(`/api/v1/appointments-services/${id}`),
    onSuccess: (result) => {
      invalidateAppointment(queryClient, result?.id);
      addNotification.success({ message: 'Позиция удалена' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось удалить позицию' });
    },
  });
};
