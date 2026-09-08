import React from 'react';
import { Button } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';
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
  cancelDisabled?: boolean;
  submitLabel?: string;
  submitColor?: string;
  submitDisabled?: boolean;
  onSubmit?: () => void;
  loading?: boolean;
  /** На mobile stacked: Отмена сверху, submit снизу (оплата). */
  stackActions?: boolean;
  /** Полностью кастомные действия справа */
  children?: React.ReactNode;
}

export const FormModalFooter: React.FC<FormModalFooterProps> = ({
  metaLabel,
  metaValue,
  meta,
  dangerActions,
  cancelLabel,
  onCancel,
  cancelDisabled = false,
  submitLabel,
  submitColor,
  submitDisabled = false,
  onSubmit,
  loading = false,
  stackActions = false,
  children,
}) => {
  const { t } = useI18n();
  const resolvedCancelLabel = cancelLabel ?? t('common.cancel');
  const hasMeta = meta != null || metaValue != null;
  const stretch = !hasMeta && !dangerActions && !children;

  return (
    <footer
      className={styles.footer}
      data-stretch={stretch || undefined}
      data-stack={stackActions || undefined}
    >
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
          <Button
            className={`${styles.footerCancel} ${stretch ? styles.footerBtn : ''}`}
            variant="outline"
            color="sage"
            size="sm"
            onClick={onCancel}
            disabled={loading || cancelDisabled}
          >
            {resolvedCancelLabel}
          </Button>
        )}
        {onSubmit && submitLabel && (
          <Button
            className={`${styles.footerSubmit} ${stretch ? styles.footerBtn : ''}`}
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
};
