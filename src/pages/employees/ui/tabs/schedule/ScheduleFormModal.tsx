import React from 'react';
import { Chip, Group } from '@mantine/core';
import { CalendarBlankIcon } from '@phosphor-icons/react';
import { DAY_OF_WEEK_OPTIONS } from '@/shared/lib/format';
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
}) => (
  <FormModal
    opened={opened}
    onClose={onClose}
    title={hasSchedule ? 'Редактировать график' : 'Новый график'}
    subtitle="Рабочие дни и время смен"
    icon={<CalendarBlankIcon size={22} />}
    size="lg"
    footer={
      <FormModalFooter
        onCancel={onClose}
        submitLabel="Сохранить"
        onSubmit={onSubmit}
        submitDisabled={!hasSchedule && dayEntries.length === 0}
        loading={loading}
      />
    }
  >
    <FormSection title="Рабочие дни" hint="Выберите дни недели, в которые сотрудник работает">
      <Chip.Group
        multiple
        value={dayEntries.map((e) => String(e.day))}
        onChange={(values) => {
          onDayEntriesChange(syncDayEntriesFromChipSelection(dayEntries, values.map(Number)));
        }}
      >
        <Group gap="xs">
          {DAY_OF_WEEK_OPTIONS.map((opt) => (
            <Chip key={opt.value} value={opt.value} radius="md" size="sm">
              {opt.label}
            </Chip>
          ))}
        </Group>
      </Chip.Group>
    </FormSection>

    <FormSection title="График">
      {dayEntries.length > 0 ? (
        <ScheduleDayTimeRows dayEntries={dayEntries} onDayEntriesChange={onDayEntriesChange} />
      ) : (
        <div className={formModalStyles.emptyState}>Отметьте рабочие дни, чтобы задать время</div>
      )}
    </FormSection>
  </FormModal>
);
