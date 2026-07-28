import React from 'react';
import dayjs from 'dayjs';
import { Alert, Avatar, Box, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { ResourcesDayView, type ScheduleEventData } from '@mantine/schedule';
import type { Employee } from '@/shared/api/types';
import { getEmployeeInitials } from '@/shared/lib/format';
import type { AppointmentFormValues } from '../lib/appointmentForm';
import styles from './board-page.module.css';

const padTime = (v: number) => v.toString().padStart(2, '0');

const RESOURCE_LABEL_WIDTH = 300;
const START_HOUR = 8;
const END_HOUR = 24;
const SLOT_COUNT = END_HOUR - START_HOUR;

interface BoardAppointment {
  id: number;
  employeeId: number;
  client: string;
  service: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  paid: boolean;
  cancelled: boolean;
  totalPrice: number;
}

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
  const { ref: containerRef, width: containerWidth } = useElementSize();

  const slotWidth = React.useMemo(() => {
    if (containerWidth <= 0) return '80px';
    const available = containerWidth - RESOURCE_LABEL_WIDTH;
    return `${Math.floor(available / SLOT_COUNT)}px`;
  }, [containerWidth]);

  const resources = React.useMemo(
    () =>
      filteredEmployees.map((emp) => ({
        id: emp.id,
        label: `${emp.firstname} ${emp.lastname ?? ''}`.trim(),
      })),
    [filteredEmployees],
  );

  const scheduleEvents: ScheduleEventData[] = React.useMemo(
    () =>
      boardAppointments.map((appt) => ({
        id: `${appt.id}-${appt.employeeId}`,
        title: `${appt.client} · ${appt.service}`,
        start: `${dateStr} ${padTime(appt.startHour)}:${padTime(appt.startMinute)}:00`,
        end: `${dateStr} ${padTime(appt.endHour)}:${padTime(appt.endMinute)}:00`,
        color: appt.cancelled ? 'gray' : appt.paid ? 'sage' : 'orange',
        resourceId: appt.employeeId,
      })),
    [boardAppointments, dateStr],
  );

  const scheduleDateStr = React.useMemo(() => dayjs(date).format('YYYY-MM-DD'), [date]);

  const handleScheduleDateChange = React.useCallback(
    (_newDate: string) => {
      // Handled by parent via sidebar
    },
    [],
  );

  const handleEventClick = React.useCallback(
    (event: ScheduleEventData) => {
      const idStr = String(event.id);
      const [apptIdStr, empIdStr] = idStr.split('-');
      const apptId = Number(apptIdStr);
      const empId = Number(empIdStr);
      if (!isNaN(apptId) && !isNaN(empId)) {
        onEventClick(apptId, empId);
      }
    },
    [onEventClick],
  );

  const handleTimeSlotClick = React.useCallback(
    ({ slotStart, slotEnd, resourceId }: { slotStart: string; slotEnd: string; resourceId?: string | number }) => {
      onSlotCreate({
        employeeId: resourceId != null ? String(resourceId) : null,
        date: dateStr,
        startTime: dayjs(slotStart).format('HH:mm'),
        endTime: dayjs(slotEnd).format('HH:mm'),
      });
    },
    [onSlotCreate, dateStr],
  );

  const handleSlotDragEnd = React.useCallback(
    ({ rangeStart, rangeEnd, resourceId }: { rangeStart: string; rangeEnd: string; resourceId?: string | number }) => {
      onSlotCreate({
        employeeId: resourceId != null ? String(resourceId) : null,
        date: dateStr,
        startTime: dayjs(rangeStart).format('HH:mm'),
        endTime: dayjs(rangeEnd).format('HH:mm'),
      });
    },
    [onSlotCreate, dateStr],
  );

  if (filteredEmployees.length === 0 && employeeFilter.size > 0) {
    return (
      <Alert color="gray" title="Фильтр сотрудников" m="md">
        Выберите сотрудников в панели выше или сбросьте фильтр
      </Alert>
    );
  }

  if (boardEmployees.length === 0) {
    return (
      <Alert color="gray" title="Нет сотрудников с графиком" m="md">
        На выбранную дату нет сотрудников с рабочим графиком
      </Alert>
    );
  }

  return (
    <Box ref={containerRef} className={styles.scheduleContainer}>
      <ResourcesDayView
        date={scheduleDateStr}
        onDateChange={handleScheduleDateChange}
        resources={resources}
        events={scheduleEvents}
        startTime="08:00:00"
        endTime="24:00:00"
        locale="ru"
        withCurrentTimeIndicator
        withDragSlotSelect
        withHeader={false}
        slotWidth={slotWidth}
        onTimeSlotClick={handleTimeSlotClick}
        onSlotDragEnd={handleSlotDragEnd}
        onEventClick={handleEventClick}
        startScrollTime="09:00:00"
        classNames={{
          resourcesDayViewRoot: styles.scheduleRoot,
          resourcesDayViewResourceLabel: styles.scheduleResourceLabel,
        }}
        renderResourceLabel={(resource) => (
          <Box className={styles.resourceLabel}>
            <Avatar size="sm" radius="md" color="sage">
              {getEmployeeInitials(
                filteredEmployees.find((e) => e.id === resource.id) ?? {
                  firstname: String(resource.label).charAt(0),
                  lastname: '',
                },
              )}
            </Avatar>
            <Box>
              <Text size="sm" fw={500} lineClamp={1}>
                {resource.label}
              </Text>
              <Text size="xs" c="dimmed">
                Сотрудник
              </Text>
            </Box>
          </Box>
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
