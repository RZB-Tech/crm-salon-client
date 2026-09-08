import React from 'react';
import { Box } from '@mantine/core';
import type { Employee } from '@/shared/api/types';
import type { AppointmentFormValues } from '../lib/appointmentForm';
import { padTime, type BoardAppointment } from '../lib/appointmentBoard';
import {
  layoutMobileAppointments,
  minutesToMobileTop,
  MOBILE_GRID_HEIGHT,
  MOBILE_HOUR_LABELS,
  MOBILE_SLOT_PX,
  MOBILE_TIME_END,
} from '../lib/boardMobileLayout';
import { BoardMobileAppointmentCard } from './BoardMobileAppointmentCard';
import { BoardScheduleEmptyState } from './BoardScheduleEmptyState';
import styles from './board-mobile-schedule.module.css';

interface BoardMobileScheduleProps {
  dateStr: string;
  isAtToday: boolean;
  filteredEmployees: Employee[];
  boardEmployees: Employee[];
  boardAppointments: BoardAppointment[];
  employeeFilter: Set<number>;
  onEventClick: (appointmentId: number, employeeId: number) => void;
  onSlotCreate: (prefill: Partial<AppointmentFormValues>) => void;
}

export const BoardMobileSchedule: React.FC<BoardMobileScheduleProps> = ({
  dateStr,
  isAtToday,
  filteredEmployees,
  boardEmployees,
  boardAppointments,
  employeeFilter,
  onEventClick,
  onSlotCreate,
}) => {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    if (!isAtToday) return undefined;
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, [isAtToday]);

  const laidOut = React.useMemo(
    () => layoutMobileAppointments(boardAppointments),
    [boardAppointments],
  );

  const nowTop = minutesToMobileTop(now.getHours(), now.getMinutes());
  const showNow =
    isAtToday && nowTop >= 0 && nowTop <= MOBILE_GRID_HEIGHT;

  const emptyState = BoardScheduleEmptyState({
    filteredEmployeesCount: filteredEmployees.length,
    employeeFilterSize: employeeFilter.size,
    boardEmployeesCount: boardEmployees.length,
  });

  const handleHourClick = React.useCallback(
    (hour: number) => {
      const defaultEmployee = filteredEmployees[0];
      onSlotCreate({
        employeeId: defaultEmployee ? String(defaultEmployee.id) : null,
        date: dateStr,
        startTime: `${padTime(hour)}:00`,
        endTime: `${padTime(Math.min(hour + 1, MOBILE_TIME_END + 1))}:00`,
      });
    },
    [dateStr, filteredEmployees, onSlotCreate],
  );

  if (emptyState) return emptyState;

  return (
    <Box className={styles.container}>
      <div className={styles.grid} style={{ height: MOBILE_GRID_HEIGHT }}>
        <div className={styles.times}>
          {MOBILE_HOUR_LABELS.map((item) => (
            <div key={item.hour} className={styles.timeCell}>
              {item.label}
            </div>
          ))}
        </div>
        <div className={styles.slots}>
          {MOBILE_HOUR_LABELS.map((item) => (
            <button
              key={item.hour}
              type="button"
              className={styles.hour}
              style={{ height: MOBILE_SLOT_PX }}
              onClick={() => handleHourClick(item.hour)}
              aria-label={item.label}
            />
          ))}
          {laidOut.map((item) => (
            <BoardMobileAppointmentCard
              key={`${item.appt.id}-${item.appt.employeeId}`}
              item={item}
              onClick={onEventClick}
            />
          ))}
          {showNow && (
            <div className={styles.nowLine} style={{ top: nowTop }}>
              <span className={styles.nowDot} />
            </div>
          )}
        </div>
      </div>
    </Box>
  );
};
