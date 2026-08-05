import React from 'react';
import { Alert, Select } from '@mantine/core';
import type { AppointmentCancelledReason } from '@/shared/api/types';
import { APPOINTMENT_CANCELLED_REASON_OPTIONS } from '@/shared/lib/format';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';

interface BoardCancelConfirmModalProps {
  opened: boolean;
  loading: boolean;
  hasActiveReceipt: boolean;
  cancelReason: AppointmentCancelledReason | '';
  onCancelReasonChange: (reason: AppointmentCancelledReason) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export const BoardCancelConfirmModal: React.FC<BoardCancelConfirmModalProps> = ({
  opened,
  loading,
  hasActiveReceipt,
  cancelReason,
  onCancelReasonChange,
  onConfirm,
  onClose,
}) => (
  <ConfirmModal
    opened={opened}
    title="Отменить запись"
    message="Отменить эту запись? Она останется в системе, но будет помечена как отменённая. Оплаченные записи и записи с активным чеком отменить нельзя — сначала отмените чек."
    confirmLabel="Отменить запись"
    loading={loading}
    confirmDisabled={!cancelReason || hasActiveReceipt}
    onConfirm={onConfirm}
    onClose={onClose}
  >
    {hasActiveReceipt && (
      <Alert color="orange" mb="sm">
        Есть активный чек. Сначала отмените его в блоке оплаты.
      </Alert>
    )}
    <Select
      label="Причина отмены"
      data={APPOINTMENT_CANCELLED_REASON_OPTIONS}
      value={cancelReason}
      onChange={(value) => {
        if (value) onCancelReasonChange(value as AppointmentCancelledReason);
      }}
      allowDeselect={false}
    />
  </ConfirmModal>
);
