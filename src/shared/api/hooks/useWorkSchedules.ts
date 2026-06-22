import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiDelete,
  apiFetchAllGet,
  apiPatch,
  apiPost,
  apiRequest,
} from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  WorkSchedule,
  WorkScheduleCreatePayload,
  WorkScheduleUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useWorkSchedules = () =>
  useQuery({
    queryKey: queryKeys.workSchedules.all,
    queryFn: () => apiFetchAllGet<WorkSchedule>('/api/v1/work-schedules'),
  });

export const useWorkSchedule = (id: number) =>
  useQuery({
    queryKey: queryKeys.workSchedules.detail(id),
    queryFn: () => apiRequest<WorkSchedule>(`/api/v1/work-schedules/${id}`),
    enabled: id > 0,
  });

export const useCreateWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkScheduleCreatePayload) =>
      apiPost<WorkSchedule, WorkScheduleCreatePayload>('/api/v1/work-schedules', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workSchedules.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.employees.workSchedules(payload.employee_id),
      });
      addNotification.success({ message: 'Смена добавлена' });
    },
  });
};

export const useUpdateWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkScheduleUpdatePayload) =>
      apiPatch<WorkSchedule, WorkScheduleUpdatePayload>('/api/v1/work-schedules', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workSchedules.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      addNotification.success({ message: 'Смена обновлена' });
    },
  });
};

export const useDeleteWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/work-schedules/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workSchedules.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      addNotification.success({ message: 'Смена удалена' });
    },
  });
};
