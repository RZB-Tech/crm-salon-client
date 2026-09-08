import { toDateInput } from '@/shared/lib/format';
import type { AnalyticsPeriod } from '@/shared/api/types';

export type DatePreset = 'last7' | 'last30' | 'month' | 'year' | 'custom';

export const ANALYTICS_PERIODS: AnalyticsPeriod[] = ['by day', 'by week', 'by month', 'by year'];

const RANGE_PRESETS: Exclude<DatePreset, 'custom'>[] = ['last7', 'last30', 'month', 'year'];

export const PERIOD_LABEL_KEY: Record<AnalyticsPeriod, string> = {
  'by day': 'analytics.period.day',
  'by week': 'analytics.period.week',
  'by month': 'analytics.period.month',
  'by year': 'analytics.period.year',
};

const toLocalDate = (value: string): Date => new Date(`${value}T00:00:00`);

const isoWeek = (date: Date): number => {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export const isPeriodValid = (
  startDate: string,
  endDate: string,
  period: AnalyticsPeriod,
): boolean => {
  if (!startDate || !endDate || startDate > endDate) return false;
  const start = toLocalDate(startDate);
  const end = toLocalDate(endDate);

  if (period === 'by day') return startDate !== endDate;
  if (period === 'by year') return start.getFullYear() !== end.getFullYear();
  if (period === 'by month') {
    return start.getMonth() !== end.getMonth() || start.getFullYear() !== end.getFullYear();
  }

  return !(
    isoWeek(start) === isoWeek(end) &&
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()
  );
};

export const firstValidPeriod = (startDate: string, endDate: string): AnalyticsPeriod | null =>
  ANALYTICS_PERIODS.find((period) => isPeriodValid(startDate, endDate, period)) ?? null;

export const rangeForPreset = (preset: Exclude<DatePreset, 'custom'>): {
  start_date: string;
  end_date: string;
} => {
  const end = new Date();
  const start = new Date();

  if (preset === 'last7') start.setDate(end.getDate() - 6);
  if (preset === 'last30') start.setDate(end.getDate() - 29);
  if (preset === 'month') start.setDate(1);
  if (preset === 'year') {
    start.setMonth(0, 1);
  }

  const startDate = toDateInput(start);
  const endDate = toDateInput(end);
  if (startDate !== endDate) return { start_date: startDate, end_date: endDate };

  start.setDate(end.getDate() - 6);
  return { start_date: toDateInput(start), end_date: endDate };
};

export const matchPreset = (startDate: string, endDate: string): DatePreset => {
  for (const preset of RANGE_PRESETS) {
    const range = rangeForPreset(preset);
    if (range.start_date === startDate && range.end_date === endDate) return preset;
  }
  return 'custom';
};

export const formatPeriodLabel = (date: string, period: AnalyticsPeriod): string => {
  const [year, month, day] = date.split('-');
  if (period === 'by year') return year;
  if (period === 'by month') return `${month}.${year}`;
  if (period === 'by week') return String(isoWeek(toLocalDate(date)));
  return `${day}.${month}`;
};

export const formatPercent = (value: number): string => `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;

export const formatRangeLabel = (startDate: string, endDate: string): string =>
  `${formatPeriodLabel(startDate, 'by day')} — ${formatPeriodLabel(endDate, 'by day')}`;

export const previousRange = (
  startDate: string,
  endDate: string,
): { start_date: string; end_date: string } => {
  const start = toLocalDate(startDate);
  const end = toLocalDate(endDate);
  const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - days);
  return { start_date: toDateInput(prevStart), end_date: toDateInput(prevEnd) };
};

export const deltaPercent = (current: number, previous: number): number | null => {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
};

export const formatDelta = (value: number | null): string => {
  if (value == null) return '';
  const rounded = Math.abs(value) >= 10 ? Math.round(value) : Number(value.toFixed(1));
  if (rounded === 0) return '0%';
  return `${rounded > 0 ? '+' : ''}${rounded}%`;
};

export const shareOf = (value: number, max: number): number => {
  if (max <= 0) return 0;
  return Math.min(100, Math.round((value / max) * 100));
};
