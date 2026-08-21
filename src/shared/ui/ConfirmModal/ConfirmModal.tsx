import React from 'react';
import { Button, Modal } from '@mantine/core';
import { WarningIcon } from '@phosphor-icons/react';
import { useI18n } from '@/shared/lib/i18n';
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
  confirmLabel,
  confirmDisabled = false,
  tone = 'danger',
  children,
  onConfirm,
  onClose,
}) => {
  const { t } = useI18n();
  const stackId = React.useId();
  const resolvedConfirmLabel = confirmLabel ?? t('common.archive');

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      stackId={stackId}
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
            {t('common.cancel')}
          </Button>
          <Button
            color={tone === 'warning' ? 'orange' : 'red'}
            onClick={onConfirm}
            loading={loading}
            disabled={confirmDisabled}
          >
            {resolvedConfirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
