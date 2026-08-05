import React from 'react';
import { Button } from '@mantine/core';
import { Archive, ArrowCounterClockwise, Prohibit } from '@phosphor-icons/react';
import { formatPrice } from '@/shared/lib/format';
import styles from './appointment-form-modal.module.css';

interface AppointmentFormFooterProps {
  mode: 'create' | 'edit';
  tab: string;
  total: number;
  isValid: boolean;
  loading: boolean;
  cancelled: boolean;
  archived: boolean;
  paid: boolean;
  structureLocked: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onCancel?: () => void;
}

export const AppointmentFormFooter: React.FC<AppointmentFormFooterProps> = ({
  mode,
  tab,
  total,
  isValid,
  loading,
  cancelled,
  archived,
  paid,
  structureLocked,
  onClose,
  onSubmit,
  onDelete,
  onRestore,
  onCancel,
}) => (
  <footer className={styles.footer}>
    <div className={styles.footerMeta}>
      {mode === 'create' || tab === 'main' ? (
        <>
          <span className={styles.footerTotalLabel}>Сумма визита</span>
          <span className={styles.footerTotalValue}>{formatPrice(total)}</span>
        </>
      ) : (
        <Button variant="subtle" color="gray" size="compact-sm" onClick={onClose}>
          Закрыть
        </Button>
      )}
    </div>

    <div className={styles.footerActions}>
      {mode === 'edit' && tab === 'main' && (
        <div className={styles.dangerActions}>
          {archived && onRestore && (
            <Button
              variant="light"
              color="teal"
              size="sm"
              leftSection={<ArrowCounterClockwise size={14} />}
              onClick={onRestore}
              loading={loading}
            >
              Восстановить
            </Button>
          )}
          {!archived && onCancel && !cancelled && !paid && (
            <Button
              variant="subtle"
              color="orange"
              size="sm"
              leftSection={<Prohibit size={14} />}
              onClick={onCancel}
              loading={loading}
              disabled={structureLocked}
            >
              Отменить
            </Button>
          )}
          {!archived && onDelete && (
            <Button
              variant="subtle"
              color="red"
              size="sm"
              leftSection={<Archive size={14} />}
              onClick={onDelete}
              loading={loading}
            >
              В архив
            </Button>
          )}
        </div>
      )}

      {mode === 'create' && (
        <Button variant="default" size="sm" onClick={onClose}>
          Отмена
        </Button>
      )}

      {(tab === 'main' || mode === 'create') && !cancelled && !archived && (
        <Button onClick={onSubmit} loading={loading} disabled={!isValid} size="sm">
          {mode === 'edit' ? 'Сохранить' : 'Создать запись'}
        </Button>
      )}
    </div>
  </footer>
);
