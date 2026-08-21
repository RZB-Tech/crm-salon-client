import React from 'react';
import { Chip, Group } from '@mantine/core';
import { CalendarBlankIcon } from '@phosphor-icons/react';
import { DAY_OF_WEEK_OPTIONS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { FormModal, FormModalFooter, FormSection, formModalStyles } from '@/shared/ui';
import type { DayTimeEntry } from '../../../lib/scheduleHelpers';
import { syncDayEntriesFromChipSelection } from '../../../lib/scheduleHelpers';
import { ScheduleDayTimeRows } from './ScheduleDayTimeRows';

export interface ScheduleFormModalProps {
  opened: boolean;
  hasSchedule: boolean;
  dayEntries: DayTimeEntry[];
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onDayEntriesChange: (entries: DayTimeEntry[]) => void;
}

export const ScheduleFormModal: React.FC<ScheduleFormModalProps> = ({
  opened,
  hasSchedule,
  dayEntries,
  loading,
  onClose,
  onSubmit,
  onDayEntriesChange,
}) => {
  const { t } = useI18n();
  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={hasSchedule ? t('form.editWorkDays') : t('form.newSchedule')}
      icon={<CalendarBlankIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('common.save')}
          onSubmit={onSubmit}
          submitDisabled={!hasSchedule && dayEntries.length === 0}
          loading={loading}
        />
      }
    >
      <FormSection title={t('form.workDays')} hint={t('form.workDaysHint')}>
        <Chip.Group
          multiple
          value={dayEntries.map((e) => String(e.day))}
          onChange={(values) => {
            onDayEntriesChange(syncDayEntriesFromChipSelection(dayEntries, values.map(Number)));
          }}
        >
          <Group gap="xs">
            {DAY_OF_WEEK_OPTIONS().map((opt) => (
              <Chip key={opt.value} value={opt.value} radius="md" size="sm">
                {opt.label}
              </Chip>
            ))}
          </Group>
        </Chip.Group>
      </FormSection>

      <FormSection title={t('form.schedule')}>
        {dayEntries.length > 0 ? (
          <ScheduleDayTimeRows dayEntries={dayEntries} onDayEntriesChange={onDayEntriesChange} />
        ) : (
          <div className={formModalStyles.emptyState}>{t('employees.markWorkDays')}</div>
        )}
      </FormSection>
    </FormModal>
  );
};
