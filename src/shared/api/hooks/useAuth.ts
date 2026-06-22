import { useMutation } from '@tanstack/react-query';
import { apiPost, authStorage } from '@/shared/api/client';
import type { LoginPayload } from '@/shared/api/types';
import { addNotification } from '@/shared/lib/notifications';

export const useLogin = () =>
  useMutation({
    mutationFn: (payload: LoginPayload) =>
      apiPost<void, LoginPayload>('/api/v1/auth/login', payload),
    onSuccess: () => {
      authStorage.setAuthenticated(true);
      addNotification.success({ message: 'Вход выполнен' });
    },
  });

export const useLogout = () =>
  useMutation({
    mutationFn: () => apiPost<void, Record<string, never>>('/api/v1/auth/logout', {}),
    onSuccess: () => {
      authStorage.setAuthenticated(false);
      window.location.href = '/login';
    },
  });

export const useRefreshToken = () =>
  useMutation({
    mutationFn: () => apiPost<void, Record<string, never>>('/api/v1/auth/refresh', {}),
    onSuccess: () => {
      authStorage.setAuthenticated(true);
    },
  });
