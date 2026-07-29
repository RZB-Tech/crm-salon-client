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
  });
};

export const useDeleteAppointmentRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiDelete(`/api/v1/appointments-records/${id}`) as Promise<unknown> as Promise<Appointment>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      addNotification.success({ message: 'Мастер убран из записи' });
    },
  });
};
