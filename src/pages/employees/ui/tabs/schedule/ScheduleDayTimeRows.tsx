import React from 'react';
import { Group, Stack, Text } from '@mantine/core';
import { TimePicker } from '@mantine/dates';
import { DAY_OF_WEEK_LABELS } from '@/shared/lib/format';
import type { DayTimeEntry } from '../../../lib/scheduleHelpers';
import { updateDayEntryTime } from '../../../lib/scheduleHelpers';
import scheduleStyles from '../schedule-tab.module.css';

interface ScheduleDayTimeRowsProps {
  dayEntries: DayTimeEntry[];
  onDayEntriesChange: (entries: DayTimeEntry[]) => void;
}

export const ScheduleDayTimeRows: React.FC<ScheduleDayTimeRowsProps> = ({
  dayEntries,
  onDayEntriesChange,
}) => (
  <Stack gap="xs">
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
);
