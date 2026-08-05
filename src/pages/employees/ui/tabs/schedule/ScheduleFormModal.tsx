import React from 'react';
import { Button, Chip, Group, Modal, Stack, Text } from '@mantine/core';
import { TimePicker } from '@mantine/dates';
import { DAY_OF_WEEK_LABELS, DAY_OF_WEEK_OPTIONS } from '@/shared/lib/format';
import type { DayTimeEntry } from '../../../lib/scheduleHelpers';
import { syncDayEntriesFromChipSelection, updateDayEntryTime } from '../../../lib/scheduleHelpers';
import scheduleStyles from '../schedule-tab.module.css';

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
  <Modal
    opened={opened}
    onClose={onClose}
    title={hasSchedule ? 'Редактировать график' : 'Новый график'}
    radius="md"
    size="lg"
  >
    <Text size="sm" fw={500} mb={6}>
      Выберите рабочие дни и задайте время
    </Text>
    <Chip.Group
      multiple
      value={dayEntries.map((e) => String(e.day))}
      onChange={(values) => {
        onDayEntriesChange(syncDayEntriesFromChipSelection(dayEntries, values.map(Number)));
      }}
    >
      <Group gap="xs" mb="md">
        {DAY_OF_WEEK_OPTIONS.map((opt) => (
          <Chip key={opt.value} value={opt.value} radius="md" size="sm">
            {opt.label}
          </Chip>
        ))}
      </Group>
    </Chip.Group>

    {dayEntries.length > 0 && (
      <Stack gap="xs" mb="lg">
        {dayEntries.map((entry) => (
          <Group key={entry.day} grow align="center">
            <Text size="sm" fw={500} className={scheduleStyles.dayName}>
              {DAY_OF_WEEK_LABELS[entry.day]}
            </Text>
            <TimePicker
              size="xs"
              minutesStep={15}
              value={entry.startTime}
              onChange={(value) =>
                onDayEntriesChange(updateDayEntryTime(dayEntries, entry.day, 'startTime', value))
              }
            />
            <Text size="xs" c="dimmed" ta="center">
              —
            </Text>
            <TimePicker
              size="xs"
              minutesStep={15}
              value={entry.endTime}
              onChange={(value) =>
                onDayEntriesChange(updateDayEntryTime(dayEntries, entry.day, 'endTime', value))
              }
            />
          </Group>
        ))}
      </Stack>
    )}

    <Group justify="flex-end" mt="md">
      <Button variant="subtle" color="gray" onClick={onClose}>
        Отмена
      </Button>
      <Button onClick={onSubmit} loading={loading} disabled={!hasSchedule && dayEntries.length === 0}>
        Сохранить
      </Button>
    </Group>
  </Modal>
);
