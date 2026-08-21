import React from 'react';
import { Box, Button, ScrollArea, Text, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';
import { formatPrice } from '@/shared/lib/format';
import { getDateLocale, useI18n } from '@/shared/lib/i18n';
import styles from './board-sidebar.module.css';
import { BoardMiniCalendar } from './BoardMiniCalendar';

interface BoardSidebarProps {
  date: Date;
  isAtToday: boolean;
  markedDates: Set<string>;
  dayRevenue: number;
  appointmentsCount: number;
  onDateChange: (date: Date) => void;
  onGoToday: () => void;
}

export const BoardSidebar: React.FC<BoardSidebarProps> = ({
  date,
  isAtToday,
  markedDates,
  dayRevenue,
  appointmentsCount,
  onDateChange,
  onGoToday
}) => {
  const { t } = useI18n();
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const clockLabel = now.toLocaleTimeString(getDateLocale(), {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const dateLabel = date.toLocaleDateString(getDateLocale(), {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <aside className={styles.sidebar}>
      <ScrollArea className={styles.scroll} offsetScrollbars>
        <Box className={styles.clock}>{clockLabel}</Box>

        <Box className={styles.section}>
          <Text size='sm' fw={600} tt='capitalize' lineClamp={2}>
            {dateLabel}
          </Text>
          {!isAtToday && (
            <Button variant='light' color='gray' size='xs' fullWidth mt='xs' onClick={onGoToday}>
              {t('board.today')}
            </Button>
          )}
        </Box>

        <Box className={styles.section}>
          <BoardMiniCalendar date={date} markedDates={markedDates} onDateChange={onDateChange} />
        </Box>

        <Box className={styles.section}>
          <Text size='xs' fw={600} c='dimmed' tt='uppercase' mb={8}>
            {t('board.dayRevenue')}
          </Text>
          <Text size='xl' fw={700} className={styles.revenueValue}>
            {formatPrice(dayRevenue)}
          </Text>
          <Text size='xs' c='dimmed' mt={4}>
            {appointmentsCount} {appointmentsCount === 1 ? t('board.appointmentOne') : t('board.appointmentMany')}
          </Text>
        </Box>

        <Box className={styles.section}>
          <Text size='xs' fw={600} c='dimmed' tt='uppercase' mb={8}>
            {t('form.client')}
          </Text>
          <TextInput
            placeholder={t('board.searchClient')}
            leftSection={<MagnifyingGlassIcon size={16} />}
            size='sm'
            disabled
          />
          <Text size='xs' c='dimmed' mt={6}>
            {t('board.soonSearch')}
          </Text>
        </Box>
      </ScrollArea>
    </aside>
  );
};
