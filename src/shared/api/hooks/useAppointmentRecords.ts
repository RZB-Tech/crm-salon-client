import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiPost } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type { Appointment, AppointmentRecordCreatePayload } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useCreateAppointmentRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentRecordCreatePayload) =>
      apiPost<Appointment, AppointmentRecordCreatePayload>(
        '/api/v1/appointments-records',
        payload,
      ),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(result.id) });
      addNotification.success({ message: 'Мастер добавлен к записи' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось добавить мастера' });
    },
  });
};

export const useDeleteAppointmentRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete<Appointment>(`/api/v1/appointments-records/${id}`),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      if (result?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointments.detail(result.id) });
      }
      addNotification.success({ message: 'Мастер убран из записи' });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || 'Не удалось убрать мастера' });
    },
  });
};
