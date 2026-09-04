import { useQuery } from '@tanstack/react-query';
import { apiPost } from '@/shared/api/client';
import { queryKeys } from '@/shared/api/query-keys';
import type {
  AnalyticsFilters,
  AnalyticsPeriodFilters,
  AppointmentAnalytics,
  EmployeeAnalytics,
  ReceiptAnalytics,
  ServiceAnalytics,
  TransactionAnalytics,
  TransactionPeriodAnalytics,
} from '@/shared/api/types';

const isRangeValid = (filters: AnalyticsFilters): boolean =>
  Boolean(filters.start_date && filters.end_date && filters.start_date <= filters.end_date);

export const useReceiptAnalytics = (filters: AnalyticsFilters, enabled = true) =>
  useQuery({
    queryKey: queryKeys.analytics.receipts(filters),
    queryFn: () => apiPost<ReceiptAnalytics, AnalyticsFilters>('/api/v1/analytics/receipts/kpi', filters),
    enabled: enabled && isRangeValid(filters),
  });

export const useAppointmentAnalytics = (filters: AnalyticsFilters, enabled = true) =>
  useQuery({
    queryKey: queryKeys.analytics.appointments(filters),
    queryFn: () =>
      apiPost<AppointmentAnalytics, AnalyticsFilters>('/api/v1/analytics/appointments/kpi', filters),
    enabled: enabled && isRangeValid(filters),
  });

export const useTransactionAnalytics = (filters: AnalyticsFilters, enabled = true) =>
  useQuery({
    queryKey: queryKeys.analytics.transactions(filters),
    queryFn: () =>
      apiPost<TransactionAnalytics, AnalyticsFilters>('/api/v1/analytics/transactions/kpi', filters),
    enabled: enabled && isRangeValid(filters),
  });

export const useTransactionPeriodAnalytics = (filters: AnalyticsPeriodFilters, enabled = true) =>
  useQuery({
    queryKey: queryKeys.analytics.transactionsByPeriod(filters),
    queryFn: () =>
      apiPost<TransactionPeriodAnalytics, AnalyticsPeriodFilters>(
        '/api/v1/analytics/transactions/by-period',
        filters,
      ),
    enabled: enabled && isRangeValid(filters),
  });

export const useEmployeeAnalytics = (filters: AnalyticsFilters, enabled = true) =>
  useQuery({
    queryKey: queryKeys.analytics.employees(filters),
    queryFn: () =>
      apiPost<EmployeeAnalytics, AnalyticsFilters>('/api/v1/analytics/employees/kpi', filters),
    enabled: enabled && isRangeValid(filters),
  });

export const useServiceAnalytics = (filters: AnalyticsFilters, enabled = true) =>
  useQuery({
    queryKey: queryKeys.analytics.services(filters),
    queryFn: () => apiPost<ServiceAnalytics, AnalyticsFilters>('/api/v1/analytics/services/kpi', filters),
    enabled: enabled && isRangeValid(filters),
  });
