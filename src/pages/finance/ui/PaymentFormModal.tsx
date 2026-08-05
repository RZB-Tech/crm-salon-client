import React from 'react';
import { Button, Checkbox, Group, Modal, NumberInput, Select } from '@mantine/core';
import { useCreatePayment } from '@/shared/api/hooks/usePayments';
import { useReceipts } from '@/shared/api/hooks/useReceipts';
import type { PaymentMethod } from '@/shared/api/types';
import { formatPrice, PAYMENT_METHOD_OPTIONS } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';

interface PaymentFormModalProps {
  opened: boolean;
  onClose: () => void;
  initialReceiptId?: number | null;
}

export const PaymentFormModal: React.FC<PaymentFormModalProps> = ({ opened, onClose, initialReceiptId }) => {
  const [receiptId, setReceiptId] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState(0);
  const [method, setMethod] = React.useState<PaymentMethod>('cash');
  const [addChangeToDeposit, setAddChangeToDeposit] = React.useState(false);

  const { data: receipts } = useReceipts();
  const createPayment = useCreatePayment();

  const pendingReceiptOptions = React.useMemo(
    () =>
      (receipts ?? [])
        .filter((r) => r.status === 'pending')
        .map((r) => ({ value: String(r.id), label: `#${r.id} · ${formatPrice(r.remaining_amount)}` })),
    [receipts],
  );

  useResetOnOpen(opened, () => {
    const receipt = initialReceiptId != null
      ? (receipts ?? []).find((r) => r.id === initialReceiptId)
      : null;
    setReceiptId(initialReceiptId != null ? String(initialReceiptId) : null);
    setAmount(receipt?.remaining_amount ?? 0);
    setMethod('cash');
    setAddChangeToDeposit(false);
  });

  const handleReceiptChange = React.useCallback(
    (value: string | null) => {
      setReceiptId(value);
      const receipt = value != null
        ? (receipts ?? []).find((r) => String(r.id) === value)
        : null;
      setAmount(receipt?.remaining_amount ?? 0);
    },
    [receipts],
  );

  const handleSubmit = React.useCallback(() => {
    if (!receiptId) return;
    createPayment.mutate(
      {
        receipt_id: Number(receiptId),
        amount,
        method,
        add_change_to_deposit: addChangeToDeposit,
      },
      { onSuccess: onClose },
    );
  }, [receiptId, amount, method, addChangeToDeposit, createPayment, onClose]);

  return (
    <Modal opened={opened} onClose={onClose} title="Провести оплату" radius="md">
      <Select label="Чек" searchable mb="md" data={pendingReceiptOptions} value={receiptId} onChange={handleReceiptChange} />
      <NumberInput
        label="Сумма"
        min={1}
        mb="md"
        value={amount}
        onChange={(value) => setAmount(Number(value) || 0)}
        thousandSeparator=" "
        suffix=" сум"
      />
      <Select
        label="Способ оплаты"
        mb="md"
        data={PAYMENT_METHOD_OPTIONS}
        value={method}
        onChange={(value) => setMethod((value as PaymentMethod) ?? 'cash')}
      />
      <Checkbox
        label="Сдачу на депозит клиента"
        mb="lg"
        checked={addChangeToDeposit}
        onChange={(event) => setAddChangeToDeposit(event.currentTarget.checked)}
      />
      <Group justify="flex-end">
        <Button variant="subtle" color="gray" onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} loading={createPayment.isPending} disabled={!receiptId || amount <= 0}>
          Оплатить
        </Button>
      </Group>
    </Modal>
  );
};
