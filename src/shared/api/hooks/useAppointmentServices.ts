import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiPatch, apiPost } from '@/shared/api/client';
import { invalidateAppointmentRelations } from '@/shared/api/invalidate';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Appointment,
  AppointmentServiceCreatePayload,
  AppointmentServiceUpdatePayload,
} from '@/shared/api/types';
import { t } from '@/shared/lib/i18n';
import { addNotification } from '@/shared/lib/notifications';

const cacheAppointment = (
  queryClient: ReturnType<typeof useQueryClient>,
  result: Appointment,
) => {
  queryClient.setQueryData(queryKeys.appointments.detail(result.id), result);
};

export const useCreateAppointmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentServiceCreatePayload) =>
      apiPost<Appointment, AppointmentServiceCreatePayload>(
        '/api/v1/appointments-services',
        payload,
      ),
    onSuccess: async (result) => {
      cacheAppointment(queryClient, result);
      await invalidateAppointmentRelations(queryClient, {
        appointmentId: result.id,
        clientId: result.client_id ?? result.client?.id ?? null,
        employeeId: result.records?.[0]?.employee_id ?? null,
      });
      addNotification.success({ message: t('toast.lineAdded') });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || t('toast.lineAddFailed') });
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
    onSuccess: async (result) => {
      cacheAppointment(queryClient, result);
      await invalidateAppointmentRelations(queryClient, {
        appointmentId: result.id,
        clientId: result.client_id ?? result.client?.id ?? null,
        employeeId: result.records?.[0]?.employee_id ?? null,
      });
      addNotification.success({ message: t('toast.lineUpdated') });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || t('toast.lineUpdateFailed') });
    },
  });
};

export const useDeleteAppointmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete<Appointment>(`/api/v1/appointments-services/${id}`),
    onSuccess: async (result) => {
      if (result?.id) cacheAppointment(queryClient, result);
      await invalidateAppointmentRelations(queryClient, {
        appointmentId: result?.id,
        clientId: result?.client_id ?? result?.client?.id ?? null,
        employeeId: result?.records?.[0]?.employee_id ?? null,
      });
      addNotification.success({ message: t('toast.lineDeleted') });
    },
    onError: (error: Error) => {
      addNotification.error({ message: error.message || t('toast.lineDeleteFailed') });
    },
  });
};
