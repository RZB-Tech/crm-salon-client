import React from 'react';
import { Group, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { ListTabs } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import type { DatePreset } from '../lib/analyticsHelpers';

interface AnalyticsToolbarProps {
  preset: DatePreset;
  startDate: string;
  endDate: string;
  branchId: number | null;
  branchOptions: { value: string; label: string }[];
  showBranchSelect: boolean;
  onPresetChange: (preset: DatePreset) => void;
  onRangeChange: (startDate: string, endDate: string) => void;
  onBranchChange: (branchId: number | null) => void;
}

export const AnalyticsToolbar: React.FC<AnalyticsToolbarProps> = ({
  preset,
  startDate,
  endDate,
  branchId,
  branchOptions,
  showBranchSelect,
  onPresetChange,
  onRangeChange,
  onBranchChange,
}) => {
  const { t } = useI18n();

  return (
    <Group gap={8} wrap="wrap" justify="flex-end">
      <ListTabs
        value={preset}
        onChange={(value) => onPresetChange(value as DatePreset)}
        data={[
          { value: 'last7', label: t('analytics.preset7') },
          { value: 'last30', label: t('analytics.preset30') },
          { value: 'month', label: t('analytics.presetMonth') },
          { value: 'year', label: t('analytics.presetYear') },
        ]}
      />
      <DateInput
        placeholder={t('form.periodFrom')}
        value={startDate}
        maxDate={endDate}
        onChange={(value) => {
          if (value) onRangeChange(value, endDate);
        }}
        size="sm"
        w={140}
      />
      <DateInput
        placeholder={t('form.periodTo')}
        value={endDate}
        minDate={startDate}
        onChange={(value) => {
          if (value) onRangeChange(startDate, value);
        }}
        size="sm"
        w={140}
      />
      {showBranchSelect ? (
        <Select
          placeholder={t('form.branch')}
          data={branchOptions}
          value={branchId == null ? '' : String(branchId)}
          onChange={(value) => onBranchChange(value ? Number(value) : null)}
          size="sm"
          w={200}
        />
      ) : null}
    </Group>
  );
};
