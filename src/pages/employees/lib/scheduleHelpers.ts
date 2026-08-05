import type {
  WorkScheduleCreatePayload,
  WorkScheduleDay,
  WorkScheduleUpdatePayload,
} from '@/shared/api/types';
import { formatTime, toApiTime } from '@/shared/lib/format';

export interface DayTimeEntry {
  day: number;
  startTime: string;
  endTime: string;
}

export const ALL_DAYS = [1, 2, 3, 4, 5, 6, 7] as const;

export const buildDayScheduleMap = (schedules: WorkScheduleDay[]) => {
  const map = new Map<number, WorkScheduleDay>();
  for (const s of schedules) map.set(s.day, s);
  return map;
};

export const buildDayEntriesForEdit = (dayScheduleMap: Map<number, WorkScheduleDay>): DayTimeEntry[] =>
  ALL_DAYS.map((day) => {
    const existing = dayScheduleMap.get(day);
    return {
      day,
      startTime: existing ? formatTime(existing.start_time) : '09:00',
      endTime: existing ? formatTime(existing.end_time) : '18:00',
    };
  }).filter((e) => dayScheduleMap.has(e.day));

export const buildDefaultDayEntry = (day: number): DayTimeEntry => ({
  day,
  startTime: '09:00',
  endTime: '18:00',
});

export const updateDayEntryTime = (
  entries: DayTimeEntry[],
  day: number,
  field: 'startTime' | 'endTime',
  value: string,
): DayTimeEntry[] => entries.map((e) => (e.day === day ? { ...e, [field]: value } : e));

export const syncDayEntriesFromChipSelection = (
  prev: DayTimeEntry[],
  selectedDays: number[],
): DayTimeEntry[] => {
  const kept = prev.filter((e) => selectedDays.includes(e.day));
  const added = selectedDays
    .filter((d) => !prev.some((e) => e.day === d))
    .map(buildDefaultDayEntry);
  return [...kept, ...added].sort((a, b) => a.day - b.day);
};

export const buildScheduleCreatePayload = (
  employeeId: number,
  entries: DayTimeEntry[],
): WorkScheduleCreatePayload => ({
  employee_id: employeeId,
  work_schedules: entries.map((e) => ({
    day: e.day,
    start_time: toApiTime(e.startTime),
    end_time: toApiTime(e.endTime),
  })),
});

export const getScheduleDiff = (
  dayEntries: DayTimeEntry[],
  schedules: WorkScheduleDay[],
  dayScheduleMap: Map<number, WorkScheduleDay>,
) => ({
  updatePayload: {
    work_schedules: schedules
      .filter((s) => dayEntries.some((e) => e.day === s.day))
      .map((s) => {
        const entry = dayEntries.find((e) => e.day === s.day)!;
        return { id: s.id, start_time: toApiTime(entry.startTime), end_time: toApiTime(entry.endTime) };
      }),
  } satisfies WorkScheduleUpdatePayload,
  newDays: dayEntries.filter((e) => !dayScheduleMap.has(e.day)),
  removedDays: schedules.filter((s) => !dayEntries.some((e) => e.day === s.day)),
});
