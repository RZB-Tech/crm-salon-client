import React from 'react';
import { Alert, Select } from '@mantine/core';
import type { AppointmentCancelledReason } from '@/shared/api/types';
import { APPOINTMENT_CANCELLED_REASON_OPTIONS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
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
}) => {
  const { t } = useI18n();
  return (
  <ConfirmModal
    opened={opened}
    title={t('board.cancelVisit')}
    message={t('board.cancelMessage')}
    confirmLabel={t('board.cancelVisit')}
    loading={loading}
    confirmDisabled={!cancelReason || hasActiveReceipt}
    onConfirm={onConfirm}
    onClose={onClose}
  >
    {hasActiveReceipt && (
      <Alert color="orange" mb="sm">
        {t('board.activeReceiptAlert')}
      </Alert>
    )}
    <Select
      label={t('board.cancelReason')}
      data={APPOINTMENT_CANCELLED_REASON_OPTIONS()}
      value={cancelReason}
      onChange={(value) => {
        if (value) onCancelReasonChange(value as AppointmentCancelledReason);
      }}
      allowDeselect={false}
    />
  </ConfirmModal>
  );
};
