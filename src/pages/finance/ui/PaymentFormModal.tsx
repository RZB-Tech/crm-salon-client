import React from 'react';
import { Badge, Checkbox, NumberInput, Select, Stack } from '@mantine/core';
import { CurrencyCircleDollarIcon } from '@phosphor-icons/react';
import { useCreatePayment } from '@/shared/api/hooks/usePayments';
import { useReceipts } from '@/shared/api/hooks/useReceipts';
import type { PaymentMethod } from '@/shared/api/types';
import { formatPrice, PAYMENT_METHOD_OPTIONS } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';

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

  const selectedReceipt = React.useMemo(
    () => (receipts ?? []).find((r) => String(r.id) === receiptId) ?? null,
    [receipts, receiptId],
  );

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
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Провести оплату"
      subtitle={
        selectedReceipt
          ? `Чек #${selectedReceipt.id} · всего ${formatPrice(selectedReceipt.total_amount)}`
          : 'Выберите чек, ожидающий оплаты'
      }
      icon={<CurrencyCircleDollarIcon size={22} />}
      headerAside={
        selectedReceipt ? (
          <Badge variant="light" color="orange" radius="sm">
            Остаток {formatPrice(selectedReceipt.remaining_amount)}
          </Badge>
        ) : undefined
      }
      size="lg"
      footer={
        <FormModalFooter
          metaLabel="Сумма оплаты"
          metaValue={formatPrice(amount)}
          onCancel={onClose}
          submitLabel="Оплатить"
          onSubmit={handleSubmit}
          submitDisabled={!receiptId || amount <= 0}
          loading={createPayment.isPending}
        />
      }
    >
      <FormSection title="Оплата">
        <Stack gap="sm">
          <Select
            label="Чек"
            searchable
            data={pendingReceiptOptions}
            value={receiptId}
            onChange={handleReceiptChange}
          />
          <FormFieldGrid cols={2}>
            <NumberInput
              label="Сумма"
              min={1}
              value={amount}
              onChange={(value) => setAmount(Number(value) || 0)}
              thousandSeparator=" "
              suffix=" сум"
            />
            <Select
              label="Способ оплаты"
              data={PAYMENT_METHOD_OPTIONS}
              value={method}
              onChange={(value) => setMethod((value as PaymentMethod) ?? 'cash')}
            />
          </FormFieldGrid>
          <Checkbox
            label="Сдачу на депозит клиента"
            checked={addChangeToDeposit}
            onChange={(event) => setAddChangeToDeposit(event.currentTarget.checked)}
          />
        </Stack>
      </FormSection>
    </FormModal>
  );
};
