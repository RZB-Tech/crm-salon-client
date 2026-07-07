import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiPatch, apiRequest } from '@/shared/api/client';
import { addNotification } from '@/shared/lib/notifications';

export interface TenantPreferences {
  theme: 'light' | 'dark';
  timezone: string;
  currency: string;
  enable_telegram_booking: boolean;
  cancel_payment_due: number;
}

export interface TenantPreferencesUpdatePayload {
  theme?: 'light' | 'dark';
  timezone?: string;
  currency?: string;
  enable_telegram_booking?: boolean;
  cancel_payment_due?: number;
}

const QUERY_KEY = ['tenant-preferences'] as const;

export const useTenantPreferences = () =>
  useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => apiRequest<TenantPreferences>('/api/v1/tenant-preferences'),
  });

export const useUpdateTenantPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TenantPreferencesUpdatePayload) =>
      apiPatch<TenantPreferences, TenantPreferencesUpdatePayload>(
        '/api/v1/tenant-preferences',
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      addNotification.success({ message: 'Настройки сохранены' });
    },
  });
};
