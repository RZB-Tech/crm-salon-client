import React from 'react';
import { Box } from '@mantine/core';
import { ResourcesDayView } from '@mantine/schedule';
import type { Employee } from '@/shared/api/types';
import type { AppointmentFormValues } from '../lib/appointmentForm';
import type { BoardAppointment } from './boardScheduleTypes';
import { BoardResourceLabel } from './BoardResourceLabel';
import { BoardScheduleEmptyState } from './BoardScheduleEmptyState';
import { useBoardSchedule } from './useBoardSchedule';
import styles from './board-page.module.css';

interface BoardScheduleProps {
  date: Date;
  dateStr: string;
  filteredEmployees: Employee[];
  boardEmployees: Employee[];
  boardAppointments: BoardAppointment[];
  employeeFilter: Set<number>;
  onEventClick: (appointmentId: number, employeeId: number) => void;
  onSlotCreate: (prefill: Partial<AppointmentFormValues>) => void;
}

export const BoardSchedule: React.FC<BoardScheduleProps> = ({
  date,
  dateStr,
  filteredEmployees,
  boardEmployees,
  boardAppointments,
  employeeFilter,
  onEventClick,
  onSlotCreate,
}) => {
  const schedule = useBoardSchedule({
    date,
    dateStr,
    filteredEmployees,
    boardAppointments,
    onEventClick,
    onSlotCreate,
  });

  const emptyState = BoardScheduleEmptyState({
    filteredEmployeesCount: filteredEmployees.length,
    employeeFilterSize: employeeFilter.size,
    boardEmployeesCount: boardEmployees.length,
  });

  if (emptyState) return emptyState;

  return (
    <Box ref={schedule.containerRef} className={styles.scheduleContainer}>
      <ResourcesDayView
        date={schedule.scheduleDateStr}
        onDateChange={() => {}}
        resources={schedule.resources}
        events={schedule.scheduleEvents}
        startTime="08:00:00"
        endTime="24:00:00"
        intervalMinutes={60}
        locale="ru"
        withCurrentTimeIndicator
        withDragSlotSelect
        withHeader={false}
        onTimeSlotClick={schedule.handleTimeSlotClick}
        onSlotDragEnd={schedule.handleSlotDragEnd}
        onEventClick={schedule.handleEventClick}
        style={
          {
            '--resources-day-view-resource-label-width': schedule.labelWidthCss,
          } as React.CSSProperties
        }
        styles={{
          resourcesDayView: {
            '--resources-day-view-resource-label-width': schedule.labelWidthCss,
          } as React.CSSProperties,
        }}
        classNames={{
          resourcesDayView: styles.scheduleView,
          resourcesDayViewRoot: styles.scheduleRoot,
          resourcesDayViewScrollArea: styles.scheduleScrollArea,
          resourcesDayViewInner: styles.scheduleInner,
          resourcesDayViewTimeLabelsRow: styles.scheduleTimeRow,
          resourcesDayViewRow: styles.scheduleRow,
          resourcesDayViewRowSlots: styles.scheduleRowSlots,
          resourcesDayViewTimeLabel: styles.scheduleTimeSlot,
          resourcesDayViewRowSlot: styles.scheduleTimeSlot,
          resourcesDayViewResourceLabel: styles.scheduleResourceLabel,
          resourcesDayViewCorner: styles.scheduleCorner,
        }}
        renderResourceLabel={(resource) => (
          <BoardResourceLabel
            label={String(resource.label)}
            resourceId={Number(resource.id)}
            labelWidth={schedule.labelWidth}
            employees={filteredEmployees}
          />
        )}
        labels={{
          today: 'Сегодня',
          day: 'День',
          week: 'Неделя',
          month: 'Месяц',
          resources: 'Сотрудники',
          previous: 'Назад',
          next: 'Вперёд',
        }}
      />
    </Box>
  );
};
