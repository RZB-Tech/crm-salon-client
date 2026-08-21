import React from 'react';
import { Textarea } from '@mantine/core';
import { ConfirmModal } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';

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
}) => {
  const { t } = useI18n();
  return (
  <ConfirmModal
    opened={opened}
    title={t('giftCards.cancelTitle')}
    message={t('form.cancelGiftCardMessage', { code })}
    confirmLabel={t('form.cancelGiftCard')}
    tone="warning"
    loading={loading}
    confirmDisabled={!reason.trim()}
    onConfirm={onConfirm}
    onClose={onClose}
  >
    <Textarea
      required
      label={t('form.reason')}
      placeholder={t('form.cancelGiftCardReason')}
      minRows={2}
      value={reason}
      onChange={(event) => onReasonChange(event.currentTarget.value)}
    />
  </ConfirmModal>
  );
};
