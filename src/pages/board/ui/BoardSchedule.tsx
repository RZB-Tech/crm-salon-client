import React from 'react';
import dayjs from 'dayjs';
import { Alert, Avatar, Box, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { ResourcesDayView, type ScheduleEventData } from '@mantine/schedule';
import type { AppointmentStatus, Employee } from '@/shared/api/types';
import { getEmployeeInitials } from '@/shared/lib/format';
import type { AppointmentFormValues } from '../lib/appointmentForm';
import styles from './board-page.module.css';

const padTime = (v: number) => v.toString().padStart(2, '0');

/** Employee column ≈ 20% of board width, clamped for readability */
const LABEL_MIN = 144;
const LABEL_MAX = 300;

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
  status: AppointmentStatus;
  cancelled: boolean;
  totalPrice: number;
}

const getEventColor = (appt: BoardAppointment): string => {
  if (appt.cancelled) return 'gray';
  if (appt.paid) return 'sage';
  if (appt.status === 'started') return 'blue';
  if (appt.status === 'finished') return 'teal';
  return 'orange';
};

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

  const labelWidth = React.useMemo(() => {
    if (containerWidth <= 0) return 240;
    return Math.round(Math.min(LABEL_MAX, Math.max(LABEL_MIN, containerWidth * 0.2)));
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
        color: getEventColor(appt),
        resourceId: appt.employeeId,
      })),
    [boardAppointments, dateStr],
  );

  const scheduleDateStr = React.useMemo(() => dayjs(date).format('YYYY-MM-DD'), [date]);

  const handleScheduleDateChange = React.useCallback(() => {
    // Смена даты обрабатывается родителем через сайдбар
  }, []);

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

  const labelWidthCss = `${labelWidth}px`;

  return (
    <Box ref={containerRef} className={styles.scheduleContainer}>
      <ResourcesDayView
        date={scheduleDateStr}
        onDateChange={handleScheduleDateChange}
        resources={resources}
        events={scheduleEvents}
        startTime="08:00:00"
        endTime="24:00:00"
        intervalMinutes={60}
        locale="ru"
        withCurrentTimeIndicator
        withDragSlotSelect
        withHeader={false}
        onTimeSlotClick={handleTimeSlotClick}
        onSlotDragEnd={handleSlotDragEnd}
        onEventClick={handleEventClick}
        style={
          {
            '--resources-day-view-resource-label-width': labelWidthCss,
          } as React.CSSProperties
        }
        styles={{
          resourcesDayView: {
            '--resources-day-view-resource-label-width': labelWidthCss,
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
          <Box className={styles.resourceLabel}>
            <Avatar size="sm" radius="md" color="sage" style={{ flex: '0 0 auto' }}>
              {getEmployeeInitials(
                filteredEmployees.find((e) => e.id === resource.id) ?? {
                  firstname: String(resource.label).charAt(0),
                  lastname: '',
                },
              )}
            </Avatar>
            <Box className={styles.resourceLabelText} data-compact={labelWidth < 180 || undefined}>
              <Text size="sm" fw={500} lineClamp={1}>
                {resource.label}
              </Text>
              {labelWidth >= 200 && (
                <Text size="xs" c="dimmed" lineClamp={1}>
                  Сотрудник
                </Text>
              )}
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
