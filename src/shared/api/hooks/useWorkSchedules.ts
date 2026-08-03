import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiDelete,
  apiPatch,
  apiPost,
  apiRequest,
} from '@/shared/api/client';
import { invalidateEmployeeSchedule } from '@/shared/api/invalidate';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  WorkSchedule,
  WorkScheduleCreatePayload,
  WorkScheduleUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useEmployeeWorkSchedule = (employeeId: number) =>
  useQuery({
    queryKey: queryKeys.employees.workSchedules(employeeId),
    queryFn: () => apiRequest<WorkSchedule>(`/api/v1/work-schedules/${employeeId}`),
    enabled: employeeId > 0,
  });

export const useCreateWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkScheduleCreatePayload) =>
      apiPost<WorkSchedule, WorkScheduleCreatePayload>('/api/v1/work-schedules', payload),
    onSuccess: async (_, payload) => {
      await invalidateEmployeeSchedule(queryClient, payload.employee_id);
      addNotification.success({ message: 'График сохранён' });
    },
  });
};

export const useUpdateWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: WorkScheduleUpdatePayload) =>
      apiPatch<WorkSchedule, WorkScheduleUpdatePayload>('/api/v1/work-schedules', payload),
    onSuccess: async (result) => {
      await invalidateEmployeeSchedule(queryClient, result.employee_id);
      addNotification.success({ message: 'График обновлён' });
    },
  });
};

export const useDeleteWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete<WorkSchedule>(`/api/v1/work-schedules/${id}`),
    onSuccess: async (result) => {
      await invalidateEmployeeSchedule(queryClient, result?.employee_id);
      addNotification.success({ message: 'Смена удалена' });
    },
  });
};
