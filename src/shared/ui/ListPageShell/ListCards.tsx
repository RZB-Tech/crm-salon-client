import React from 'react';
import { Text } from '@mantine/core';
import styles from './list-page-shell.module.css';

interface ListCardsProps {
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export const ListCards: React.FC<ListCardsProps> = ({
  children,
  isEmpty = false,
  emptyMessage,
}) => {
  if (isEmpty) {
    return (
      <div className={styles.cards}>
        <Text c="dimmed" ta="center" py="xl">
          {emptyMessage}
        </Text>
      </div>
    );
  }

  return <div className={styles.cards}>{children}</div>;
};

interface ListCardFieldProps {
  label: string;
  value: React.ReactNode;
}

export const ListCardField: React.FC<ListCardFieldProps> = ({ label, value }) => (
  <div className={styles.cardField}>
    <span className={styles.cardLabel}>{label}:</span>
    <span className={styles.cardValue}>{value}</span>
  </div>
);

interface ListEntityCardProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const ListEntityCard: React.FC<ListEntityCardProps> = ({ children, onClick }) => (
  <div
    className={styles.entityCard}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onClick={onClick}
    onKeyDown={
      onClick
        ? (event) => {
            if (event.key === 'Enter' || event.key === ' ') onClick();
          }
        : undefined
    }
  >
    {children}
  </div>
);
