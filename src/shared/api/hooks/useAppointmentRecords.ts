import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiPost } from '@/shared/api/client';
import { invalidateAppointmentRelations } from '@/shared/api/invalidate';
import { queryKeys } from '@/shared/api/query-keys';
import type { Appointment, AppointmentRecordCreatePayload } from '@/shared/api/types';
import { t } from '@/shared/lib/i18n';
import { addNotification } from '@/shared/lib/notifications';

export const useCreateAppointmentRecord = () => {
  const queryClient = useQueryClient();

  
  return useMutation({
    mutationFn: (payload: AppointmentRecordCreatePayload) =>
      apiPost<Appointment, AppointmentRecordCreatePayload>(
        '/api/v1/appointments-records',
        payload,
      ),
    onSuccess: async (result) => {
      queryClient.setQueryData(queryKeys.appointments.detail(result.id), result);
      await invalidateAppointmentRelations(queryClient, {
        appointmentId: result.id,
        clientId: result.client_id ?? result.client?.id ?? null,
        employeeId: result.records?.[0]?.employee_id ?? null,
      });
      addNotification.success({ message: t('toast.masterAdded') });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || t('toast.masterAddFailed') });
    },
  });
};

export const useDeleteAppointmentRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete<Appointment>(`/api/v1/appointments-records/${id}`),
    onSuccess: async (result) => {
      if (result?.id) {
        queryClient.setQueryData(queryKeys.appointments.detail(result.id), result);
      }
      await invalidateAppointmentRelations(queryClient, {
        appointmentId: result?.id,
        clientId: result?.client_id ?? result?.client?.id ?? null,
        employeeId: result?.records?.[0]?.employee_id ?? null,
      });
      addNotification.success({ message: t('toast.masterRemoved') });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || t('toast.masterRemoveFailed') });
    },
  });
};
