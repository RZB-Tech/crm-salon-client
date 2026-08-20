import React from 'react';
import { Button } from '@mantine/core';
import { ArrowCounterClockwise, Prohibit } from '@phosphor-icons/react';
import { FormModalFooter } from '@/shared/ui';

interface AppointmentFormFooterProps {
  mode: 'create' | 'edit';
  tab: string;
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
            variant="light"
            color="red"
            size="sm"
            onClick={onDelete}
            loading={loading}
            styles={{ root: { background: 'rgba(250, 82, 82, 0.1)', color: '#fa5252' } }}
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
      metaLabel={undefined}
      metaValue={undefined}
      dangerActions={dangerActions}
      onCancel={onMainTab ? onClose : undefined}
      submitLabel={canSubmit ? (mode === 'edit' ? 'Сохранить' : 'Добавить запись') : undefined}
      onSubmit={canSubmit ? onSubmit : undefined}
      submitDisabled={!isValid}
      loading={loading}
    />
  );
};
