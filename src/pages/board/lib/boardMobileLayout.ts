import { getDateLocale, t } from '@/shared/lib/i18n';
import type { BoardAppointment } from './appointmentBoard';

export const MOBILE_SLOT_PX = 48;
export const MOBILE_TIME_START = 9;
export const MOBILE_TIME_END = 19;
export const MOBILE_HOUR_COUNT = MOBILE_TIME_END - MOBILE_TIME_START + 1;
export const MOBILE_GRID_HEIGHT = MOBILE_HOUR_COUNT * MOBILE_SLOT_PX;

export const MOBILE_HOUR_LABELS = Array.from({ length: MOBILE_HOUR_COUNT }, (_, index) => {
  const hour = MOBILE_TIME_START + index;
  return {
    hour,
    top: index * MOBILE_SLOT_PX,
    label: `${hour}:00`,
  };
});

export interface MobileLaidOutCard {
  appt: BoardAppointment;
  top: number;
  height: number;
  col: number;
  cols: number;
}

interface TimedItem {
  appt: BoardAppointment;
  start: number;
  end: number;
  col: number;
}

export const formatBoardDateChip = (date: Date): string => {
  const weekdayIndex = date.getDay() === 0 ? 7 : date.getDay();
  const weekday = t(`labels.weekday.${weekdayIndex}`);
  const month = date
    .toLocaleDateString(getDateLocale(), { month: 'short' })
    .replace('.', '')
    .trim();
  const monthLabel = month.charAt(0).toUpperCase() + month.slice(1);
  return `${date.getDate()} ${monthLabel}, ${weekday}`;
};

export const formatBoardDuration = (minutes: number): string => {
  if (minutes >= 120 && minutes % 60 === 0) {
    return t('board.hoursAbbr', { n: minutes / 60 });
  }
  return t('board.minutesAbbr', { n: minutes });
};

const MOBILE_CARD_TONES = 8;

export const getMobileCardTone = (employeeId: number): number => {
  const id = Number.isFinite(employeeId) ? employeeId : 0;
  return Math.abs(id) % MOBILE_CARD_TONES;
};

export const layoutMobileAppointments = (appointments: BoardAppointment[]): MobileLaidOutCard[] => {
  const items: TimedItem[] = appointments
    .map((appt) => ({
      appt,
      start: appt.startHour * 60 + appt.startMinute,
      end: appt.endHour * 60 + appt.endMinute,
      col: 0,
    }))
    .sort((a, b) => a.start - b.start || a.end - b.end);

  const columnEnds: number[] = [];
  for (const item of items) {
    const free = columnEnds.findIndex((end) => end <= item.start);
    if (free === -1) {
      item.col = columnEnds.length;
      columnEnds.push(item.end);
    } else {
      item.col = free;
      columnEnds[free] = item.end;
    }
  }

  return items.map((item) => {
    const overlapping = items.filter((other) => other.start < item.end && other.end > item.start);
    const cols = Math.max(...overlapping.map((other) => other.col), 0) + 1;
    const top = ((item.start - MOBILE_TIME_START * 60) / 60) * MOBILE_SLOT_PX;
    const height = Math.max(((item.end - item.start) / 60) * MOBILE_SLOT_PX - 4, 32);
    return { appt: item.appt, top, height, col: item.col, cols };
  });
};

export const minutesToMobileTop = (hours: number, minutes: number): number =>
  ((hours * 60 + minutes - MOBILE_TIME_START * 60) / 60) * MOBILE_SLOT_PX;
