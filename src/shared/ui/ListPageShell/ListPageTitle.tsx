import React from 'react';
import { UnstyledButton } from '@mantine/core';
import { CaretLeftIcon } from '@phosphor-icons/react';
import styles from './list-page-shell.module.css';

interface ListPageTitleProps {
  children: React.ReactNode;
  onBack?: () => void;
  backLabel?: string;
}

export const ListPageTitle: React.FC<ListPageTitleProps> = ({
  children,
  onBack,
  backLabel,
}) => {
  if (onBack) {
    return (
      <UnstyledButton
        className={styles.pageTitle}
        onClick={onBack}
        aria-label={backLabel}
      >
        <CaretLeftIcon size={16} />
        {children}
      </UnstyledButton>
    );
  }

  return <h1 className={styles.pageTitle}>{children}</h1>;
};
