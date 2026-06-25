import React from 'react';
import { BoardDateNav } from './BoardDateNav';
import styles from './board-toolbar-aside.module.css';

interface BoardToolbarAsideProps {
  view: 'day' | 'week';
  date: Date;
  label: string;
  isAtToday: boolean;
  onNavigate: (delta: number) => void;
  onGoToday: () => void;
  onDateChange: (date: Date) => void;
}

export const BoardToolbarAside: React.FC<BoardToolbarAsideProps> = ({
  view,
  date,
  label,
  isAtToday,
  onNavigate,
  onGoToday,
  onDateChange
}) => (
  <div className={styles.aside}>
    <div className={styles.slot} data-slot='client-search' />
    <div className={styles.slot} data-slot='revenue' />

    <BoardDateNav
      view={view}
      date={date}
      label={label}
      isAtToday={isAtToday}
      onNavigate={onNavigate}
      onGoToday={onGoToday}
      onDateChange={onDateChange}
      align='end'
    />
  </div>
);
