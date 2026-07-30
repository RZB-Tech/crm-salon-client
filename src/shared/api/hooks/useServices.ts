import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
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

export const useServices = (archived = false) =>
  useQuery({
    queryKey: [...queryKeys.services.all, { archived }],
    queryFn: () => apiFetchAllPost<Service>('/api/v1/services', { archived }),
  });

export const useService = (id: number) =>
  useQuery({
    queryKey: queryKeys.services.detail(id),
    queryFn: () => apiRequest<Service>(`/api/v1/services/${id}`),
    enabled: id > 0,
  });

export const useServiceCategories = (archived = false) =>
  useQuery({
    queryKey: [...queryKeys.serviceCategories.all, { archived }],
    queryFn: () => apiFetchAllPost<ServiceCategory>('/api/v1/service-categories', { archived }),
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
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Услуга обновлена' });
    },
  });
};

export const useArchiveService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<Service, { id: number; archived: boolean }>('/api/v1/services', { id, archived: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Услуга архивирована' });
    },
  });
};

export const useRestoreService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<Service, { id: number; archived: boolean }>('/api/v1/services', { id, archived: false }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: 'Услуга восстановлена' });
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

export const useArchiveServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<ServiceCategory, { id: number; archived: boolean }>(
        '/api/v1/service-categories',
        { id, archived: true },
      ),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.detail(id) });
      addNotification.success({ message: 'Категория архивирована' });
    },
  });
};

export const useRestoreServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<ServiceCategory, { id: number; archived: boolean }>(
        '/api/v1/service-categories',
        { id, archived: false },
      ),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.detail(id) });
      addNotification.success({ message: 'Категория восстановлена' });
    },
  });
};

export const useDeleteServiceCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiPatch<ServiceCategory, { id: number; archived: boolean }>(
        '/api/v1/service-categories',
        { id, archived: true },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceCategories.all });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({
        message: `Импортировано: ${result.created_services} услуг, ${result.created_categories} категорий`,
      });
    },
  });
};
