import { toDateInput } from '@/shared/lib/format';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}/;
const pad = (n: number) => String(n).padStart(2, '0');

export interface NotificationSchedule {
  date: string;
  time: string;
}

/** Дата и время «сейчас» по часам салона, округлённые вверх к шагу минут. */
export const defaultNotificationSchedule = (
  stepMinutes = 5,
  now = new Date(),
): NotificationSchedule => {
  const remainder = now.getMinutes() % stepMinutes;
  const next = new Date(now);
  if (remainder !== 0) {
    next.setMinutes(now.getMinutes() + (stepMinutes - remainder), 0, 0);
  } else {
    next.setSeconds(0, 0);
  }

  return {
    date: toDateInput(next),
    time: `${pad(next.getHours())}:${pad(next.getMinutes())}`,
  };
};

/** Локальные дата+время → ISO с таймзоной, чтобы бэкенд сравнивал с UTC. */
export const toNotificationScheduledAt = (date: string, time: string): string | null => {
  const clock = time.slice(0, 5);
  if (!DATE_RE.test(date) || !TIME_RE.test(clock)) return null;

  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = clock.split(':').map(Number);
  const local = new Date(year, month - 1, day, hours, minutes, 0, 0);
  if (Number.isNaN(local.getTime())) return null;

  return local.toISOString();
};
