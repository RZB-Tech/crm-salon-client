import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiPatch,
  apiPost,
  apiPostFormData,
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
import { t } from '@/shared/lib/i18n';
import { addNotification } from '@/shared/lib/notifications';

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ServiceCreatePayload) =>
      apiPost<Service, ServiceCreatePayload>('/api/v1/services', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.all });
      addNotification.success({ message: t('toast.serviceCreated') });
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
      addNotification.success({ message: t('toast.serviceUpdated') });
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
      addNotification.success({ message: t('toast.serviceArchived') });
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
      addNotification.success({ message: t('toast.serviceRestored') });
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
      addNotification.success({ message: t('toast.categoryCreated') });
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
      addNotification.success({ message: t('toast.categoryUpdated') });
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
      addNotification.success({ message: t('toast.categoryArchived') });
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
      addNotification.success({ message: t('toast.categoryRestored') });
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
      addNotification.success({ message: t('toast.categoryArchived') });
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
        message: t('toast.servicesImported', {
          services: result.created_services,
          categories: result.created_categories,
        }),
      });
    },
  });
};
