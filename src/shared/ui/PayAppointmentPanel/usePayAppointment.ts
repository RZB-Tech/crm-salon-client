import React from 'react';
import { useCreatePayment } from '@/shared/api/hooks/usePayments';
import { useAppointmentReceipts } from '@/shared/api/hooks/useAppointments';
import { useCancelReceipt, useCreateReceipt } from '@/shared/api/hooks/useReceipts';
import type { Appointment, PaymentMethod } from '@/shared/api/types';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';

export function usePayAppointment(appointment: Appointment) {
  const { data: receipts, isLoading: receiptsLoading } = useAppointmentReceipts(appointment.id);
  const createReceipt = useCreateReceipt();
  const createPayment = useCreatePayment();
  const cancelReceipt = useCancelReceipt();

  const [amount, setAmount] = React.useState(appointment.total_price);
  const [method, setMethod] = React.useState<PaymentMethod>('cash');
  const [addChangeToDeposit, setAddChangeToDeposit] = React.useState(true);
  const [cancelConfirmOpen, setCancelConfirmOpen] = React.useState(false);

  const receipt = React.useMemo(
    () => (receipts ?? []).find((item) => item.status !== 'cancelled') ?? null,
    [receipts],
  );

  const cancelledReceipts = React.useMemo(
    () => (receipts ?? []).filter((item) => item.status === 'cancelled'),
    [receipts],
  );

  useResetOnOpen(receipt, () => {
    if (!receipt) return;
    setAmount(receipt.remaining_amount > 0 ? receipt.remaining_amount : receipt.total_amount);
  });

  const overpay = receipt != null && amount > receipt.remaining_amount;
  const canPay =
    receipt != null &&
    receipt.status === 'pending' &&
    amount > 0 &&
    (!overpay || addChangeToDeposit);

  const handleCreateReceipt = React.useCallback(() => {
    createReceipt.mutate({
      receipt_type: 'appointment',
      appointment_id: appointment.id,
    });
  }, [appointment.id, createReceipt]);

  const handlePay = React.useCallback(() => {
    if (!receipt || !canPay) return;
    createPayment.mutate({
      receipt_id: receipt.id,
      amount,
      method,
      add_change_to_deposit: addChangeToDeposit,
    });
  }, [receipt, canPay, amount, method, addChangeToDeposit, createPayment]);

  const handleCancelReceipt = React.useCallback(() => {
    if (!receipt) return;
    cancelReceipt.mutate(receipt.id, {
      onSuccess: () => setCancelConfirmOpen(false),
    });
  }, [receipt, cancelReceipt]);

  const isPaid = receiptsLoading
    ? Boolean(appointment.paid)
    : receipt?.status === 'paid';
  const isLoading =
    createReceipt.isPending || createPayment.isPending || cancelReceipt.isPending || receiptsLoading;

  const step1Done = Boolean(appointment.records?.length);
  const step2Done = Boolean(receipt);
  const step3Done = isPaid;

  return {
    receipt,
    cancelledReceipts,
    amount,
    setAmount,
    method,
    setMethod,
    addChangeToDeposit,
    setAddChangeToDeposit,
    cancelConfirmOpen,
    setCancelConfirmOpen,
    overpay,
    canPay,
    handleCreateReceipt,
    handlePay,
    handleCancelReceipt,
    isPaid,
    isLoading,
    step1Done,
    step2Done,
    step3Done,
    createReceipt,
    cancelReceipt,
  };
}
