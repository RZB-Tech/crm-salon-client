import React from 'react';
import { Textarea } from '@mantine/core';
import { ConfirmModal } from '@/shared/ui';

interface GiftCardCancelModalProps {
  opened: boolean;
  code: string;
  reason: string;
  loading: boolean;
  onReasonChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export const GiftCardCancelModal: React.FC<GiftCardCancelModalProps> = ({
  opened,
  code,
  reason,
  loading,
  onReasonChange,
  onConfirm,
  onClose,
}) => (
  <ConfirmModal
    opened={opened}
    title="Отменить купон"
    message={`Отменить «${code}»? Можно отменить только неиспользованный купон.`}
    confirmLabel="Отменить купон"
    tone="warning"
    loading={loading}
    confirmDisabled={!reason.trim()}
    onConfirm={onConfirm}
    onClose={onClose}
  >
    <Textarea
      required
      label="Причина"
      placeholder="Почему отменяете купон"
      minRows={2}
      value={reason}
      onChange={(event) => onReasonChange(event.currentTarget.value)}
    />
  </ConfirmModal>
);
