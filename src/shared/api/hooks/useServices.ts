import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  apiDelete,
  apiFetchAllPost,
  apiPatch,
  apiPost,
  apiPostFormData,
  apiRequest,
} from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  Service,
  ServiceCategory,
  ServiceCategoryCreatePayload,
  ServiceCategoryUpdatePayload,
  ServiceCreatePayload,
  ServicesImportResult,
  ServiceUpdatePayload,
} from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useServices = () =>
  useQuery({
    queryKey: queryKeys.services.all,
    queryFn: () => apiFetchAllPost<Service>('/api/v1/services'),
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
    queryFn: () => apiFetchAllPost<ServiceCategory>('/api/v1/service-categories'),
  });

export const useServiceCategory = (id: number) =>
  useQuery({
    queryKey: queryKeys.serviceCategories.detail(id),
    queryFn: () => apiRequest<ServiceCategory>(`/api/v1/service-categories/${id}`),
    enabled: id > 0,
  });

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ServiceCreatePayload) =>
      apiPost<Service, ServiceCreatePayload>('/api/v1/services', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      addNotification.success({ message: 'Услуга создана' });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ServiceUpdatePayload) =>
      apiPatch<Service, ServiceUpdatePayload>('/api/v1/services', payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.detail(payload.id) });
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
    mutationFn: (payload: ServiceCategoryCreatePayload) =>
      apiPost<ServiceCategory, ServiceCategoryCreatePayload>(
        '/api/v1/service-categories',
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.all });
      addNotification.success({ message: 'Категория создана' });
    },
  });
};

export const useUpdateServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ServiceCategoryUpdatePayload) =>
      apiPatch<ServiceCategory, ServiceCategoryUpdatePayload>(
        '/api/v1/service-categories',
        payload,
      ),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.serviceCategories.detail(payload.id),
      });
      addNotification.success({ message: 'Категория обновлена' });
    },
  });
};

export const useDeleteServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiDelete(`/api/v1/service-categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.all });
      addNotification.success({ message: 'Категория удалена' });
    },
  });
};

export const useArchiveServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPost<ServiceCategory, Record<string, never>>(
        `/api/v1/service-categories/${id}/archive`,
        {},
      ),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.detail(id) });
      addNotification.success({ message: 'Категория архивирована' });
    },
  });
};

export const useImportServices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiPostFormData<ServicesImportResult>('/api/v1/services/import', formData);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.all });
      addNotification.success({
        message: `Импортировано: ${result.created_services} услуг, ${result.created_categories} категорий`,
      });
    },
  });
};
