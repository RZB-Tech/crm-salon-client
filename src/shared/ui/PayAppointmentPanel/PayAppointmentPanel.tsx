import React from 'react';
import type { Appointment } from '@/shared/api/types';
import { usePayAppointment } from './usePayAppointment';
import { PaidBanner } from './PaidBanner';
import { PaymentForm } from './PaymentForm';

interface PayAppointmentPanelProps {
  appointment: Appointment;
}

export const PayAppointmentPanel: React.FC<PayAppointmentPanelProps> = ({ appointment }) => {
  const pay = usePayAppointment(appointment);

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
      onMethodChange={(value) => pay.setMethod(value as typeof pay.method)}
      onAddChangeToDepositChange={pay.setAddChangeToDeposit}
      onCreateReceipt={pay.handleCreateReceipt}
      onPay={pay.handlePay}
      onOpenCancelConfirm={() => pay.setCancelConfirmOpen(true)}
      onCloseCancelConfirm={() => pay.setCancelConfirmOpen(false)}
      onConfirmCancel={pay.handleCancelReceipt}
    />
  );
};
