import React from 'react';
import { ActionIcon, Box, Text, UnstyledButton } from '@mantine/core';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { isSameDay, toDateInput } from '@/shared/lib/format';
import { getDateLocale, t } from '@/shared/lib/i18n';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import styles from './board-mini-calendar.module.css';

interface BoardMiniCalendarProps {
  date: Date;
  markedDates?: Set<string>;
  onDateChange: (date: Date) => void;
  /** overlay — мобильный попover по макету; sidebar — десктоп */
  variant?: 'sidebar' | 'overlay';
}

interface CalendarCell {
  date: Date;
  outside: boolean;
}

const WEEKDAY_LABELS = () => [
  t('labels.weekday.1'),
  t('labels.weekday.2'),
  t('labels.weekday.3'),
  t('labels.weekday.4'),
  t('labels.weekday.5'),
  t('labels.weekday.6'),
  t('labels.weekday.7'),
];

const buildMonthGrid = (
  year: number,
  month: number,
  withAdjacent: boolean,
): Array<CalendarCell | null> => {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells: Array<CalendarCell | null> = [];

  for (let index = 0; index < startOffset; index += 1) {
    const date = new Date(year, month, 1 - (startOffset - index));
    cells.push(withAdjacent ? { date, outside: true } : null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(year, month, day), outside: false });
  }

  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    const date = new Date(year, month + 1, nextDay);
    cells.push(withAdjacent ? { date, outside: true } : null);
    nextDay += 1;
  }

  return cells;
};

export const BoardMiniCalendar: React.FC<BoardMiniCalendarProps> = ({
  date,
  markedDates,
  onDateChange,
  variant = 'sidebar',
}) => {
  const today = React.useMemo(() => new Date(), []);
  const [viewMonth, setViewMonth] = React.useState(() => ({
    year: date.getFullYear(),
    month: date.getMonth()
  }));

  useResetOnOpen(date, () => setViewMonth({ year: date.getFullYear(), month: date.getMonth() }));

  const monthLabel = React.useMemo(
    () =>
      new Date(viewMonth.year, viewMonth.month, 1).toLocaleDateString(getDateLocale(), {
        month: 'long',
        year: 'numeric'
      }),
    [viewMonth.month, viewMonth.year]
  );

  const isOverlay = variant === 'overlay';
  const cells = React.useMemo(
    () => buildMonthGrid(viewMonth.year, viewMonth.month, isOverlay),
    [isOverlay, viewMonth.month, viewMonth.year],
  );

  const handlePrevMonth = React.useCallback(() => {
    setViewMonth((current) => {
      const next = new Date(current.year, current.month - 1, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }, []);

  const handleNextMonth = React.useCallback(() => {
    setViewMonth((current) => {
      const next = new Date(current.year, current.month + 1, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }, []);

  return (
    <Box className={`${styles.calendar}${isOverlay ? ` ${styles.calendarOverlay}` : ''}`}>
      <Box className={isOverlay ? styles.overlayHeader : styles.calendarHeader}>
        {isOverlay ? (
          <>
            <Text fw={600} className={styles.overlayTitle}>
              {monthLabel}
            </Text>
            <Box className={styles.overlayNav}>
              <ActionIcon variant="subtle" color="gray" size={24} onClick={handlePrevMonth}>
                <CaretLeftIcon size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="gray" size={24} onClick={handleNextMonth}>
                <CaretRightIcon size={20} />
              </ActionIcon>
            </Box>
          </>
        ) : (
          <>
            <ActionIcon variant="subtle" color="gray" size="sm" onClick={handlePrevMonth}>
              <CaretLeftIcon size={16} />
            </ActionIcon>
            <Text size="sm" fw={600} tt="capitalize" className={styles.calendarTitle}>
              {monthLabel}
            </Text>
            <ActionIcon variant="subtle" color="gray" size="sm" onClick={handleNextMonth}>
              <CaretRightIcon size={16} />
            </ActionIcon>
          </>
        )}
      </Box>

      <Box className={styles.weekdays}>
        {WEEKDAY_LABELS().map((label) => (
          <Text span key={label} className={styles.weekday}>
            {label}
          </Text>
        ))}
      </Box>

      <Box className={styles.days}>
        {cells.map((cell, index) => {
          if (!cell) {
            return <Box component="span" key={`empty-${index}`} className={styles.dayEmpty} />;
          }

          const dateKey = toDateInput(cell.date);
          const isSelected = isSameDay(cell.date, date);
          const isToday = isSameDay(cell.date, today);
          const hasAppointments = markedDates?.has(dateKey);

          return (
            <UnstyledButton
              key={dateKey}
              className={[
                styles.day,
                isSelected ? styles.day_selected : '',
                isToday ? styles.day_today : '',
                hasAppointments ? styles.day_marked : '',
                cell.outside ? styles.day_outside : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onDateChange(cell.date)}
            >
              {cell.date.getDate()}
            </UnstyledButton>
          );
        })}
      </Box>
    </Box>
  );
};
