import React from 'react';
import { Modal } from '@mantine/core';
import { BoardMiniCalendar } from './Sidebar/BoardMiniCalendar';
import styles from './board-sheet.module.css';

interface BoardDateSheetProps {
  opened: boolean;
  date: Date;
  markedDates: Set<string>;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

export const BoardDateSheet: React.FC<BoardDateSheetProps> = ({
  opened,
  date,
  markedDates,
  onDateChange,
  onClose,
}) => {
  const handleDateChange = React.useCallback(
    (next: Date) => {
      onDateChange(next);
      onClose();
    },
    [onClose, onDateChange],
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      title={null}
      radius="md"
      padding={16}
      size="auto"
      overlayProps={{ backgroundOpacity: 0.5, blur: 2 }}
      classNames={{ content: styles.dateOverlay }}
      transitionProps={{ transition: 'pop', duration: 180 }}
    >
      <BoardMiniCalendar
        variant="overlay"
        date={date}
        markedDates={markedDates}
        onDateChange={handleDateChange}
      />
    </Modal>
  );
};
