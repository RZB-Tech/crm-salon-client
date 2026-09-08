import React from 'react';
import type { Appointment } from '@/shared/api/types';
import { usePayAppointment } from './usePayAppointment';
import { PaidBanner } from './PaidBanner';
import { PaymentForm } from './PaymentForm';

interface PayAppointmentPanelProps {
  appointment: Appointment;
  onPaymentFooterChange?: (actions: PaymentFooterActions | null) => void;
}

export interface PaymentFooterActions {
  canPay: boolean;
  onPay: () => void;
  loading: boolean;
}

export const PayAppointmentPanel: React.FC<PayAppointmentPanelProps> = ({
  appointment,
  onPaymentFooterChange,
}) => {
  const pay = usePayAppointment(appointment);

  React.useEffect(() => {
    if (!onPaymentFooterChange) return;
    const canShow =
      !pay.isPaid && pay.receipt != null && pay.receipt.remaining_amount > 0;
    if (!canShow) {
      onPaymentFooterChange(null);
      return;
    }
    onPaymentFooterChange({
      canPay: pay.canPay,
      onPay: pay.handlePay,
      loading: pay.isLoading,
    });
    return () => onPaymentFooterChange(null);
  }, [
    onPaymentFooterChange,
    pay.isPaid,
    pay.receipt,
    pay.canPay,
    pay.handlePay,
    pay.isLoading,
  ]);

  if (pay.isPaid) {
    return (
      <PaidBanner
        receipt={pay.receipt}
        cancelConfirmOpen={pay.cancelConfirmOpen}
        cancelPending={pay.cancelReceipt.isPending}
        onOpenCancelConfirm={() => pay.setCancelConfirmOpen(true)}
        onCloseCancelConfirm={() => pay.setCancelConfirmOpen(false)}
        onConfirmCancel={pay.handleCancelReceipt}
      />
    );
  }

  return (
    <PaymentForm
      appointment={appointment}
      receipt={pay.receipt}
      cancelledReceiptsCount={pay.cancelledReceipts.length}
      amount={pay.amount}
      method={pay.method}
      giftCardId={pay.giftCardId}
      addChangeToDeposit={pay.addChangeToDeposit}
      overpay={pay.overpay}
      canPay={pay.canPay}
      cancelConfirmOpen={pay.cancelConfirmOpen}
      step1Done={pay.step1Done}
      step2Done={pay.step2Done}
      step3Done={pay.step3Done}
      createPending={pay.createReceipt.isPending}
      cancelPending={pay.cancelReceipt.isPending}
      payPending={pay.isLoading}
      onAmountChange={pay.setAmount}
      onMethodChange={pay.handleMethodChange}
      onGiftCardIdChange={(id, remain) => {
        pay.setGiftCardId(id);
        if (remain != null && pay.receipt) {
          pay.setAmount(Math.min(remain, pay.receipt.remaining_amount));
        }
      }}
      onAddChangeToDepositChange={pay.setAddChangeToDeposit}
      onCreateReceipt={pay.handleCreateReceipt}
      onPay={pay.handlePay}
      onOpenCancelConfirm={() => pay.setCancelConfirmOpen(true)}
      onCloseCancelConfirm={() => pay.setCancelConfirmOpen(false)}
      onConfirmCancel={pay.handleCancelReceipt}
    />
  );
};
