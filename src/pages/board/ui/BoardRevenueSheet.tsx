import React from 'react';
import { ActionIcon, Drawer, Text } from '@mantine/core';
import { XIcon } from '@phosphor-icons/react';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import styles from './board-sheet.module.css';

interface BoardRevenueSheetProps {
  opened: boolean;
  dayRevenue: number;
  appointmentsCount: number;
  onClose: () => void;
}

export const BoardRevenueSheet: React.FC<BoardRevenueSheetProps> = ({
  opened,
  dayRevenue,
  appointmentsCount,
  onClose,
}) => {
  const { t } = useI18n();
  const countLabel =
    appointmentsCount === 1 ? t('board.appointmentOne') : t('board.appointmentMany');

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      withCloseButton={false}
      padding="md"
      size="auto"
      radius={24}
      overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
      classNames={{ content: styles.sheet }}
      styles={{
        content: {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          overflow: 'hidden',
        },
      }}
    >
      <div className={styles.handle} />
      <div className={styles.header}>
        <Text fw={600} size="lg" className={styles.title}>
          {t('board.dayRevenue')}
        </Text>
        <ActionIcon variant="subtle" color="gray" size={24} onClick={onClose} aria-label={t('common.close')}>
          <XIcon size={20} />
        </ActionIcon>
      </div>
      <div className={styles.revenueCard}>
        <Text fw={700} className={styles.revenueAmount}>
          {formatPrice(dayRevenue)}
        </Text>
        <Text size="xs" c="dimmed">
          {appointmentsCount} {countLabel}
        </Text>
      </div>
    </Drawer>
  );
};
