import React from 'react';
import { ActionIcon } from '@mantine/core';
import { XIcon } from '@phosphor-icons/react';
import styles from './form-modal.module.css';

export type FormModalTone = 'brand' | 'danger' | 'warning';

export interface FormModalHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  /** Инициалы в аватаре; если не заданы — рисуется icon */
  initials?: string | null;
  icon?: React.ReactNode;
  tone?: FormModalTone;
  /** Бейджи/контролы справа от заголовка */
  aside?: React.ReactNode;
  /** Ряд бейджей под заголовком */
  badges?: React.ReactNode;
  onClose: () => void;
}

export const FormModalHeader: React.FC<FormModalHeaderProps> = ({
  title,
  subtitle,
  initials,
  icon,
  tone = 'brand',
  aside,
  badges,
  onClose,
}) => (
  <header className={styles.header} data-tone={tone}>
    <div className={styles.headerTop}>
      {(initials || icon) && <div className={styles.headerAvatar}>{initials || icon}</div>}
      <div className={styles.headerInfo}>
        <h2 className={styles.headerTitle}>{title}</h2>
        {subtitle != null && subtitle !== '' && (
          <div className={styles.headerSubtitle}>{subtitle}</div>
        )}
      </div>
      <div className={styles.headerSide}>
        {aside}
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          radius="xl"
          aria-label="Закрыть"
          onClick={onClose}
        >
          <XIcon size={18} />
        </ActionIcon>
      </div>
    </div>

    {badges != null && <div className={styles.badgeRow}>{badges}</div>}
  </header>
);
