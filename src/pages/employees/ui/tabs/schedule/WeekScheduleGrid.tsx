import React from 'react';
import { Box, Button, SimpleGrid, Text } from '@mantine/core';
import { PencilSimple, Plus } from '@phosphor-icons/react';
import type { WorkScheduleDay } from '@/shared/api/types';
import { DAY_OF_WEEK_LABELS, formatTime } from '@/shared/lib/format';
import { ALL_DAYS } from '../../../lib/scheduleHelpers';
import profileStyles from '../../employee-profile.module.css';
import scheduleStyles from '../schedule-tab.module.css';

export interface WeekScheduleGridProps {
  hasSchedule: boolean;
  dayScheduleMap: Map<number, WorkScheduleDay>;
  onEdit: () => void;
  onCreate: () => void;
}

export const WeekScheduleGrid: React.FC<WeekScheduleGridProps> = ({
  hasSchedule,
  dayScheduleMap,
  onEdit,
  onCreate,
}) => (
  <Box>
    <Box className={profileStyles.toolbar}>
      <Text fw={600}>Недельный график</Text>
      {hasSchedule ? (
        <Button size="xs" variant="light" leftSection={<PencilSimple size={14} />} onClick={onEdit}>
          Редактировать
        </Button>
      ) : (
        <Button size="xs" variant="light" leftSection={<Plus size={14} />} onClick={onCreate}>
          Добавить
        </Button>
      )}
    </Box>
    {hasSchedule ? (
      <SimpleGrid cols={{ base: 4, xs: 7 }} spacing="xs">
        {ALL_DAYS.map((dayNum) => {
          const schedule = dayScheduleMap.get(dayNum);
          return (
            <Box
              key={dayNum}
              className={`${scheduleStyles.dayCard} ${schedule ? scheduleStyles.dayCardActive : scheduleStyles.dayCardInactive}`}
            >
              <Text size="xs" fw={700} className={scheduleStyles.dayLabel}>
                {DAY_OF_WEEK_LABELS[dayNum]}
              </Text>
              {schedule ? (
                <Text size="xs" className={scheduleStyles.dayTime}>
                  {formatTime(schedule.start_time)}–{formatTime(schedule.end_time)}
                </Text>
              ) : (
                <Text size="xs" c="dimmed">
                  Вых.
                </Text>
              )}
            </Box>
          );
        })}
      </SimpleGrid>
    ) : (
      <Text size="sm" c="dimmed">
        График не задан
      </Text>
    )}
  </Box>
);
