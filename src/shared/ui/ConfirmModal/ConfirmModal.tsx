import React from 'react';
import { Button, Modal } from '@mantine/core';
import { WarningIcon } from '@phosphor-icons/react';
import styles from './confirm-modal.module.css';

interface ConfirmModalProps {
  opened: boolean;
  title: string;
  message: string;
  loading?: boolean;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  /** Цвет акцента: danger — красный (по умолчанию), warning — оранжевый */
  tone?: 'danger' | 'warning';
  children?: React.ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  opened,
  title,
  message,
  loading = false,
  confirmLabel = 'Удалить',
  confirmDisabled = false,
  tone = 'danger',
  children,
  onConfirm,
  onClose,
}) => (
  <Modal
    opened={opened}
    onClose={onClose}
    withCloseButton={false}
    centered
    radius="lg"
    size={420}
    padding={0}
  >
    <div className={styles.body}>
      <div className={styles.iconWrap} data-tone={tone}>
        <WarningIcon size={26} weight="fill" />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {children != null && <div className={styles.extra}>{children}</div>}
      <div className={styles.actions}>
        <Button variant="default" onClick={onClose} disabled={loading}>
          Отмена
        </Button>
        <Button
          color={tone === 'warning' ? 'orange' : 'red'}
          onClick={onConfirm}
          loading={loading}
          disabled={confirmDisabled}
        >
          {confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);
