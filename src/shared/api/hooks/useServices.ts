import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiListRequestAll, apiPatch, apiPost, apiRequest } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  CreateServiceCategoryPayload,
  CreateServicePayload,
  PatchedService,
  PatchedServiceCategory,
  Service,
  ServiceCategory,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useServices = () =>
  useQuery({
    queryKey: queryKeys.services.all,
    queryFn: () => apiListRequestAll<Service>('/api/v1/services'),
  });

export const useService = (id: number) =>
  useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => apiRequest<Service>(`/api/v1/services/${id}`),
    enabled: id > 0,
  });

export const useServiceCategories = () =>
  useQuery({
    queryKey: queryKeys.serviceCategories.all,
    queryFn: () => apiListRequestAll<ServiceCategory>('/api/v1/service-category'),
  });

export const useServiceCategory = (id: number) =>
  useQuery({
    queryKey: queryKeys.serviceCategories.detail(id),
    queryFn: () => apiRequest<ServiceCategory>(`/api/v1/service-category/${id}`),
    enabled: id > 0,
  });

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServicePayload) =>
      apiPost<Service, CreateServicePayload>('/api/v1/services', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      addNotification.success({ message: 'Услуга создана' });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PatchedService }) =>
      apiPatch<Service, PatchedService>(`/api/v1/services/${id}`, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(id) });
      addNotification.success({ message: 'Услуга обновлена' });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      addNotification.success({ message: 'Услуга удалена' });
    },
  });
};

export const useCreateServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateServiceCategoryPayload) =>
      apiPost<ServiceCategory, CreateServiceCategoryPayload>('/api/v1/service-category', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.all });
      addNotification.success({ message: 'Категория создана' });
    },
  });
};

export const useUpdateServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: PatchedServiceCategory }) =>
      apiPatch<ServiceCategory, PatchedServiceCategory>(`/api/v1/service-category/${id}`, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.detail(id) });
      addNotification.success({ message: 'Категория обновлена' });
    },
  });
};

export const useDeleteServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/service-category/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.all });
      addNotification.success({ message: 'Категория удалена' });
    },
  });
};
