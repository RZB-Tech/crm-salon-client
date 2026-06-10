import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiListRequestAll, apiPatch, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  CreateSchedulePayload,
  PatchedSchedule,
  Schedule,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useSchedules = () =>
  useQuery({
    queryKey: queryKeys.schedules.all,
    queryFn: () => apiListRequestAll<Schedule>('/api/v1/schedules'),
  });

export const useSchedule = (id: number) =>
  useQuery({
    queryKey: queryKeys.schedules.detail(id),
    queryFn: () => apiRequest<Schedule>(`/api/v1/schedules/${id}`),
    enabled: id > 0,
  });

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSchedulePayload) =>
      apiPost<Schedule, CreateSchedulePayload>('/api/v1/schedules', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Смена добавлена' });
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PatchedSchedule }) =>
      apiPatch<Schedule, PatchedSchedule>(`/api/v1/schedules/${id}`, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Смена обновлена' });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/schedules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedules.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Смена удалена' });
    },
  });
};
