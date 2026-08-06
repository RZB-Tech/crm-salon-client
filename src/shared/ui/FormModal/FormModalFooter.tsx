import React from 'react';
import { Button } from '@mantine/core';
import styles from './form-modal.module.css';

export interface FormModalFooterProps {
  /** Левая зона: подпись + значение (например, сумма визита) */
  metaLabel?: string;
  metaValue?: React.ReactNode;
  /** Произвольная левая зона вместо metaLabel/metaValue */
  meta?: React.ReactNode;
  /** Опасные действия (архив, отмена) перед основными кнопками */
  dangerActions?: React.ReactNode;
  cancelLabel?: string;
  onCancel?: () => void;
  submitLabel?: string;
  submitColor?: string;
  submitDisabled?: boolean;
  onSubmit?: () => void;
  loading?: boolean;
  /** Полностью кастомные действия справа */
  children?: React.ReactNode;
}

export const FormModalFooter: React.FC<FormModalFooterProps> = ({
  metaLabel,
  metaValue,
  meta,
  dangerActions,
  cancelLabel = 'Отмена',
  onCancel,
  submitLabel,
  submitColor,
  submitDisabled = false,
  onSubmit,
  loading = false,
  children,
}) => (
  <footer className={styles.footer}>
    {meta ??
      (metaValue != null ? (
        <div className={styles.footerMeta}>
          {metaLabel && <span className={styles.footerTotalLabel}>{metaLabel}</span>}
          <span className={styles.footerTotalValue}>{metaValue}</span>
        </div>
      ) : null)}

    <div className={styles.footerActions}>
      {dangerActions && <div className={styles.dangerActions}>{dangerActions}</div>}
      {children}
      {onCancel && (
        <Button variant="default" size="sm" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
      )}
      {onSubmit && submitLabel && (
        <Button
          size="sm"
          color={submitColor}
          onClick={onSubmit}
          loading={loading}
          disabled={submitDisabled}
        >
          {submitLabel}
        </Button>
      )}
    </div>
  </footer>
);
