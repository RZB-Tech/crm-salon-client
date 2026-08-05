import React from 'react';
import dayjs from 'dayjs';
import { useElementSize } from '@mantine/hooks';
import type { ScheduleEventData } from '@mantine/schedule';
import type { Employee } from '@/shared/api/types';
import type { AppointmentFormValues } from '../lib/appointmentForm';
import {
  getEventColor,
  LABEL_MAX,
  LABEL_MIN,
  padTime,
  type BoardAppointment,
} from './boardScheduleTypes';

interface UseBoardScheduleOptions {
  date: Date;
  dateStr: string;
  filteredEmployees: Employee[];
  boardAppointments: BoardAppointment[];
  onEventClick: (appointmentId: number, employeeId: number) => void;
  onSlotCreate: (prefill: Partial<AppointmentFormValues>) => void;
}

export const useBoardSchedule = ({
  date,
  dateStr,
  filteredEmployees,
  boardAppointments,
  onEventClick,
  onSlotCreate,
}: UseBoardScheduleOptions) => {
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
    ({
      slotStart,
      slotEnd,
      resourceId,
    }: {
      slotStart: string;
      slotEnd: string;
      resourceId?: string | number;
    }) => {
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
    ({
      rangeStart,
      rangeEnd,
      resourceId,
    }: {
      rangeStart: string;
      rangeEnd: string;
      resourceId?: string | number;
    }) => {
      onSlotCreate({
        employeeId: resourceId != null ? String(resourceId) : null,
        date: dateStr,
        startTime: dayjs(rangeStart).format('HH:mm'),
        endTime: dayjs(rangeEnd).format('HH:mm'),
      });
    },
    [onSlotCreate, dateStr],
  );

  return {
    containerRef,
    labelWidth,
    labelWidthCss: `${labelWidth}px`,
    resources,
    scheduleEvents,
    scheduleDateStr,
    handleEventClick,
    handleTimeSlotClick,
    handleSlotDragEnd,
  };
};
