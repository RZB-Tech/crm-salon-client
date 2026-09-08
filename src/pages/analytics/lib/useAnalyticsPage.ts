import React from 'react';
import { useTenantBranches } from '@/shared/api/hooks/useTenantBranches';
import type { AnalyticsFilters, AnalyticsPeriod } from '@/shared/api/types';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { addNotification } from '@/shared/lib/notifications';
import { useI18n } from '@/shared/lib/i18n';
import {
  firstValidPeriod,
  formatRangeLabel,
  isPeriodValid,
  matchPreset,
  previousRange,
  rangeForPreset,
  type DatePreset,
} from './analyticsHelpers';

const defaultRange = rangeForPreset('last30');

export const useAnalyticsPage = () => {
  const { t } = useI18n();
  const { hasPermission, hasAnyPermission } = useAccess();
  const canManage = hasPermission(PermissionCode.ANALYTICS_MANAGE);
  const canReceipts = canManage || hasPermission(PermissionCode.ANALYTICS_RECEIPT);
  const canAppointments = canManage || hasPermission(PermissionCode.ANALYTICS_APPOINTMENT);
  const canTransactions = canManage || hasPermission(PermissionCode.ANALYTICS_TRANSACTION);
  const canEmployees = canManage || hasPermission(PermissionCode.ANALYTICS_EMPLOYEE);
  const canServices = canManage || hasPermission(PermissionCode.ANALYTICS_SERVICE);

  const canReadBranches = hasAnyPermission([
    PermissionCode.TENANT_BRANCH_READ,
    PermissionCode.TENANT_BRANCH_MANAGE,
    PermissionCode.TENANT_MANAGE,
  ]);
  const { data: branchesData } = useTenantBranches(canReadBranches);
  const isParent = branchesData?.isParent === true;

  const [preset, setPresetState] = React.useState<DatePreset>('last30');
  const [startDate, setStartDate] = React.useState(defaultRange.start_date);
  const [endDate, setEndDate] = React.useState(defaultRange.end_date);
  const [branchId, setBranchId] = React.useState<number | null>(null);
  const [period, setPeriodState] = React.useState<AnalyticsPeriod>('by day');

  const applyRange = React.useCallback((nextStart: string, nextEnd: string, nextPreset: DatePreset) => {
    if (!nextStart || !nextEnd) return;
    setStartDate(nextStart);
    setEndDate(nextEnd);
    setPresetState(nextPreset);
    setPeriodState((current) =>
      isPeriodValid(nextStart, nextEnd, current)
        ? current
        : (firstValidPeriod(nextStart, nextEnd) ?? current),
    );
  }, []);

  const setPreset = React.useCallback(
    (next: DatePreset) => {
      if (next === 'custom') {
        setPresetState('custom');
        return;
      }
      const range = rangeForPreset(next);
      applyRange(range.start_date, range.end_date, next);
    },
    [applyRange],
  );

  const setRange = React.useCallback(
    (nextStart: string, nextEnd: string) => {
      if (!nextStart || !nextEnd) return;
      let start = nextStart;
      let end = nextEnd;
      if (start > end) {
        start = nextEnd;
        end = nextStart;
        addNotification.info({ message: t('analytics.rangeSwapped') });
      }
      applyRange(start, end, matchPreset(start, end));
    },
    [applyRange, t],
  );

  const setPeriod = React.useCallback(
    (next: AnalyticsPeriod) => {
      if (isPeriodValid(startDate, endDate, next)) setPeriodState(next);
    },
    [startDate, endDate],
  );

  const previousFilters = React.useMemo<AnalyticsFilters>(() => {
    const range = previousRange(startDate, endDate);
    const payload: AnalyticsFilters = { start_date: range.start_date, end_date: range.end_date };
    if (branchId != null) payload.branch_id = branchId;
    return payload;
  }, [startDate, endDate, branchId]);

  const filters = React.useMemo<AnalyticsFilters>(() => {
    const payload: AnalyticsFilters = { start_date: startDate, end_date: endDate };
    if (branchId != null) payload.branch_id = branchId;
    return payload;
  }, [startDate, endDate, branchId]);

  const branchOptions = React.useMemo(
    () => [
      { value: '', label: t('analytics.currentOrg') },
      ...(branchesData?.branches ?? []).map((branch) => ({
        value: String(branch.id),
        label: branch.name,
      })),
    ],
    [branchesData?.branches, t],
  );

  return {
    startDate,
    endDate,
    preset,
    period,
    branchId,
    filters,
    previousFilters,
    rangeLabel: formatRangeLabel(startDate, endDate),
    setPreset,
    setRange,
    setPeriod,
    setBranchId,
    branchOptions,
    showBranchSelect: isParent && canReadBranches,
    canReceipts,
    canAppointments,
    canTransactions,
    canEmployees,
    canServices,
    periodValid: isPeriodValid(startDate, endDate, period),
  };
};
