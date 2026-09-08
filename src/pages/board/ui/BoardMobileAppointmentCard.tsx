import React from 'react';
import { Text } from '@mantine/core';
import { UserIcon } from '@phosphor-icons/react';
import { formatTimeValue } from '../lib/appointmentBoard';
import {
  formatBoardDuration,
  getMobileCardTone,
  type MobileLaidOutCard,
} from '../lib/boardMobileLayout';
import styles from './board-mobile-card.module.css';

interface BoardMobileAppointmentCardProps {
  item: MobileLaidOutCard;
  onClick: (appointmentId: number, employeeId: number) => void;
}

const TONE_CLASS = [
  styles.tone0,
  styles.tone1,
  styles.tone2,
  styles.tone3,
  styles.tone4,
  styles.tone5,
  styles.tone6,
  styles.tone7,
];

export const BoardMobileAppointmentCard: React.FC<BoardMobileAppointmentCardProps> = ({
  item,
  onClick,
}) => {
  const { appt, top, height, col, cols } = item;
  const gap = 8;
  const widthPct = 100 / cols;
  const toneClass = TONE_CLASS[getMobileCardTone(appt.employeeId)] ?? styles.tone0;

  const handleClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onClick(appt.id, appt.employeeId);
    },
    [appt.employeeId, appt.id, onClick],
  );

  return (
    <button
      type="button"
      className={`${styles.card} ${toneClass}`}
      style={{
        top,
        height,
        left: `calc(${col * widthPct}% + ${gap / 2}px)`,
        width: `calc(${widthPct}% - ${gap}px)`,
      }}
      onClick={handleClick}
    >
      <div className={styles.top}>
        <Text className={styles.client} lineClamp={1}>
          {appt.client}
        </Text>
        <div className={styles.meta}>
          <span className={styles.time}>{formatTimeValue(appt.startHour, appt.startMinute)}</span>
          <span className={styles.duration}>{formatBoardDuration(appt.duration)}</span>
        </div>
      </div>
      <Text className={styles.service} lineClamp={1}>
        {appt.service}
      </Text>
      <div className={styles.master}>
        <UserIcon size={20} className={styles.masterIcon} />
        <Text className={styles.masterName} lineClamp={1}>
          {appt.employeeName}
        </Text>
      </div>
    </button>
  );
};
