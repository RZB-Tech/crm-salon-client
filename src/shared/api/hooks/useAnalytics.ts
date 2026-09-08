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

const useAnalyticsQuery = <TResponse, TFilters extends AnalyticsFilters>(
  queryKey: readonly unknown[],
  path: string,
  filters: TFilters,
  enabled = true,
) =>
  useQuery({
    queryKey,
    queryFn: () => apiPost<TResponse, TFilters>(path, filters),
    enabled: enabled && isRangeValid(filters),
  });

export const useReceiptAnalytics = (filters: AnalyticsFilters, enabled = true) =>
  useAnalyticsQuery<ReceiptAnalytics, AnalyticsFilters>(
    queryKeys.analytics.receipts(filters),
    '/api/v1/analytics/receipts/kpi',
    filters,
    enabled,
  );

export const useAppointmentAnalytics = (filters: AnalyticsFilters, enabled = true) =>
  useAnalyticsQuery<AppointmentAnalytics, AnalyticsFilters>(
    queryKeys.analytics.appointments(filters),
    '/api/v1/analytics/appointments/kpi',
    filters,
    enabled,
  );

export const useTransactionAnalytics = (filters: AnalyticsFilters, enabled = true) =>
  useAnalyticsQuery<TransactionAnalytics, AnalyticsFilters>(
    queryKeys.analytics.transactions(filters),
    '/api/v1/analytics/transactions/kpi',
    filters,
    enabled,
  );

export const useTransactionPeriodAnalytics = (filters: AnalyticsPeriodFilters, enabled = true) =>
  useAnalyticsQuery<TransactionPeriodAnalytics, AnalyticsPeriodFilters>(
    queryKeys.analytics.transactionsByPeriod(filters),
    '/api/v1/analytics/transactions/by-period',
    filters,
    enabled,
  );

export const useEmployeeAnalytics = (filters: AnalyticsFilters, enabled = true) =>
  useAnalyticsQuery<EmployeeAnalytics, AnalyticsFilters>(
    queryKeys.analytics.employees(filters),
    '/api/v1/analytics/employees/kpi',
    filters,
    enabled,
  );

export const useServiceAnalytics = (filters: AnalyticsFilters, enabled = true) =>
  useAnalyticsQuery<ServiceAnalytics, AnalyticsFilters>(
    queryKeys.analytics.services(filters),
    '/api/v1/analytics/services/kpi',
    filters,
    enabled,
  );
