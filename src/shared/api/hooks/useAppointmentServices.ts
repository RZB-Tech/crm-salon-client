import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiPatch, apiPost } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Appointment,
  AppointmentServiceCreatePayload,
  AppointmentServiceUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useCreateAppointmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentServiceCreatePayload) =>
      apiPost<Appointment, AppointmentServiceCreatePayload>(
        '/api/v1/appointments-services',
        payload,
      ),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(result.id) });
      addNotification.success({ message: 'Услуга добавлена' });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(result.id) });
      addNotification.success({ message: 'Услуга обновлена' });
    },
  });
};

export const useDeleteAppointmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiDelete(`/api/v1/appointments-services/${id}`) as Promise<unknown> as Promise<Appointment>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      addNotification.success({ message: 'Услуга убрана' });
    },
  });
};
