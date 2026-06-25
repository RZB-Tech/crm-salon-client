import type { BoardAppointment } from './appointmentBoard';

export const getAppointmentEndMinutes = (appt: BoardAppointment): number =>
  appt.endHour * 60 + appt.endMinute;

export const getAppointmentStartMinutes = (appt: BoardAppointment): number =>
  appt.startHour * 60 + appt.startMinute;

export const hasBoardTimeConflict = (
  appointments: BoardAppointment[],
  startTotalMinutes: number,
  endTotalMinutes: number,
  employeeId?: number
): boolean =>
  appointments.some((appt) => {
    if (employeeId != null && appt.employeeId !== employeeId) return false;
    const apptStart = getAppointmentStartMinutes(appt);
    const apptEnd = getAppointmentEndMinutes(appt);
    return startTotalMinutes < apptEnd && endTotalMinutes > apptStart;
  });
