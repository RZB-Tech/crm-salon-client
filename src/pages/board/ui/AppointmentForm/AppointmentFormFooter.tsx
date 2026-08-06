import React from 'react';
import { Button } from '@mantine/core';
import { Archive, ArrowCounterClockwise, Prohibit } from '@phosphor-icons/react';
import { formatPrice } from '@/shared/lib/format';
import { FormModalFooter } from '@/shared/ui';

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
}) => {
  const onMainTab = mode === 'create' || tab === 'main';
  const canSubmit = onMainTab && !cancelled && !archived;

  const dangerActions =
    mode === 'edit' && tab === 'main' ? (
      <>
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
      </>
    ) : undefined;

  return (
    <FormModalFooter
      meta={
        onMainTab ? undefined : (
          <Button variant="subtle" color="gray" size="compact-sm" onClick={onClose}>
            Закрыть
          </Button>
        )
      }
      metaLabel={onMainTab ? 'Сумма визита' : undefined}
      metaValue={onMainTab ? formatPrice(total) : undefined}
      dangerActions={dangerActions}
      onCancel={mode === 'create' ? onClose : undefined}
      submitLabel={canSubmit ? (mode === 'edit' ? 'Сохранить' : 'Создать запись') : undefined}
      onSubmit={canSubmit ? onSubmit : undefined}
      submitDisabled={!isValid}
      loading={loading}
    />
  );
};
