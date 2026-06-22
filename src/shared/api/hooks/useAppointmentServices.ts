import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiDelete,
  apiFetchAllGet,
  apiPost,
  apiPostGetMany,
  apiRequest,
} from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  AppointmentServiceCreatePayload,
  AppointmentServiceRecord,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useAppointmentServices = () =>
  useQuery({
    queryKey: queryKeys.appointmentServices.all,
    queryFn: () => apiFetchAllGet<AppointmentServiceRecord>('/api/v1/appointments-services'),
  });

export const useAppointmentService = (id: number) =>
  useQuery({
    queryKey: queryKeys.appointmentServices.detail(id),
    queryFn: () => apiRequest<AppointmentServiceRecord>(`/api/v1/appointments-services/${id}`),
    enabled: id > 0,
  });

export const useAppointmentServicesMany = (ids: number[]) =>
  useQuery({
    queryKey: queryKeys.appointmentServices.many(ids),
    queryFn: () =>
      apiPostGetMany<AppointmentServiceRecord>('/api/v1/appointments-services', ids),
    enabled: ids.length > 0,
  });

export const useCreateAppointmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentServiceCreatePayload) =>
      apiPost<AppointmentServiceRecord, AppointmentServiceCreatePayload>(
        '/api/v1/appointments-services',
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentServices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentRecords.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      addNotification.success({ message: 'Услуга добавлена к записи' });
    },
  });
};

export const useDeleteAppointmentService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/appointments-services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentServices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentRecords.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      addNotification.success({ message: 'Услуга удалена из записи' });
    },
  });
};
