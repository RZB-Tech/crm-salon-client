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
  AppointmentRecord,
  AppointmentRecordCreatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useAppointmentRecords = () =>
  useQuery({
    queryKey: queryKeys.appointmentRecords.all,
    queryFn: () => apiFetchAllGet<AppointmentRecord>('/api/v1/appointments-records'),
  });

export const useAppointmentRecord = (id: number) =>
  useQuery({
    queryKey: queryKeys.appointmentRecords.detail(id),
    queryFn: () => apiRequest<AppointmentRecord>(`/api/v1/appointments-records/${id}`),
    enabled: id > 0,
  });

export const useAppointmentRecordsMany = (ids: number[]) =>
  useQuery({
    queryKey: queryKeys.appointmentRecords.many(ids),
    queryFn: () => apiPostGetMany<AppointmentRecord>('/api/v1/appointments-records', ids),
    enabled: ids.length > 0,
  });

export const useCreateAppointmentRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AppointmentRecordCreatePayload) =>
      apiPost<AppointmentRecord, AppointmentRecordCreatePayload>(
        '/api/v1/appointments-records',
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentRecords.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      addNotification.success({ message: 'Запись визита создана' });
    },
  });
};

export const useDeleteAppointmentRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/appointments-records/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentRecords.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments.all });
      addNotification.success({ message: 'Запись визита удалена' });
    },
  });
};
