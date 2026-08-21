import React from 'react';
import { Alert, Stack } from '@mantine/core';
import type { Appointment, PaymentMethod, Receipt } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import { useI18n } from '@/shared/lib/i18n';
import { PaymentFormHero } from './PaymentFormHero';
import { PaymentReceiptCreateSection } from './PaymentReceiptCreateSection';
import { PaymentReceiptPaySection } from './PaymentReceiptPaySection';

interface PaymentFormProps {
  appointment: Appointment;
  receipt: Receipt | null | undefined;
  cancelledReceiptsCount: number;
  amount: number;
  method: PaymentMethod;
  giftCardId: string | null;
  addChangeToDeposit: boolean;
  overpay: boolean;
  canPay: boolean;
  cancelConfirmOpen: boolean;
  step1Done: boolean;
  step2Done: boolean;
  step3Done: boolean;
  createPending: boolean;
  cancelPending: boolean;
  payPending: boolean;
  onAmountChange: (value: number) => void;
  onMethodChange: (value: PaymentMethod) => void;
  onGiftCardIdChange: (value: string | null, remainAmount?: number) => void;
  onAddChangeToDepositChange: (value: boolean) => void;
  onCreateReceipt: () => void;
  onPay: () => void;
  onOpenCancelConfirm: () => void;
  onCloseCancelConfirm: () => void;
  onConfirmCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  appointment,
  receipt,
  cancelledReceiptsCount,
  amount,
  method,
  giftCardId,
  addChangeToDeposit,
  overpay,
  canPay,
  cancelConfirmOpen,
  step1Done,
  step2Done,
  step3Done,
  createPending,
  cancelPending,
  payPending,
  onAmountChange,
  onMethodChange,
  onGiftCardIdChange,
  onAddChangeToDepositChange,
  onCreateReceipt,
  onPay,
  onOpenCancelConfirm,
  onCloseCancelConfirm,
  onConfirmCancel,
}) => {
  const { t } = useI18n();
  return (
  <Stack gap="sm">
    <PaymentFormHero
      appointment={appointment}
      receipt={receipt}
      step1Done={step1Done}
      step2Done={step2Done}
      step3Done={step3Done}
    />

    {!appointment.records?.length && (
      <Alert color="orange" variant="light" title={t('finance.noLines')}>
        {t('finance.noLinesHint')}
      </Alert>
    )}

    {!receipt ? (
      <PaymentReceiptCreateSection
        appointment={appointment}
        cancelledReceiptsCount={cancelledReceiptsCount}
        createPending={createPending}
        onCreateReceipt={onCreateReceipt}
      />
    ) : (
      <PaymentReceiptPaySection
        receipt={receipt}
        amount={amount}
        method={method}
        giftCardId={giftCardId}
        clientId={appointment.client?.id ?? appointment.client_id ?? receipt.client_id}
        addChangeToDeposit={addChangeToDeposit}
        overpay={overpay}
        canPay={canPay}
        cancelPending={cancelPending}
        payPending={payPending}
        onAmountChange={onAmountChange}
        onMethodChange={onMethodChange}
        onGiftCardIdChange={onGiftCardIdChange}
        onAddChangeToDepositChange={onAddChangeToDepositChange}
        onPay={onPay}
        onOpenCancelConfirm={onOpenCancelConfirm}
      />
    )}

    <ConfirmModal
      opened={cancelConfirmOpen}
      title={t('form.cancelReceipt')}
      message={t('finance.cancelReceiptMessage')}
      confirmLabel={t('form.cancelReceipt')}
      loading={cancelPending}
      onConfirm={onConfirmCancel}
      onClose={onCloseCancelConfirm}
    />
  </Stack>
  );
};
