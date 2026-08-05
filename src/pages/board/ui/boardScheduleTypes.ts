import type { AppointmentStatus } from '@/shared/api/types';

export interface BoardAppointment {
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

export const getEventColor = (appt: BoardAppointment): string => {
  if (appt.cancelled) return 'gray';
  if (appt.paid) return 'sage';
  if (appt.status === 'started') return 'blue';
  if (appt.status === 'finished') return 'teal';
  return 'orange';
};

export const padTime = (v: number) => v.toString().padStart(2, '0');

export const LABEL_MIN = 168;
export const LABEL_MAX = 300;
export const LABEL_TOOLTIP_BELOW = 200;
