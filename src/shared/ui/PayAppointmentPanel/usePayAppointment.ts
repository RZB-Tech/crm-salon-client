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
  const [giftCardId, setGiftCardId] = React.useState<string | null>(null);
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
    setGiftCardId(null);
  });

  const overpay = receipt != null && method !== 'gift card' && amount > receipt.remaining_amount;
  const canPay =
    receipt != null &&
    receipt.status === 'pending' &&
    amount > 0 &&
    (method !== 'gift card' || Boolean(giftCardId)) &&
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
      giftCard_id: method === 'gift card' && giftCardId ? Number(giftCardId) : null,
      add_change_to_deposit: method === 'gift card' ? false : addChangeToDeposit,
    });
  }, [receipt, canPay, amount, method, giftCardId, addChangeToDeposit, createPayment]);

  const handleMethodChange = React.useCallback((value: PaymentMethod) => {
    setMethod(value);
    if (value !== 'gift card') setGiftCardId(null);
  }, []);

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
    giftCardId,
    setGiftCardId,
    handleMethodChange,
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
