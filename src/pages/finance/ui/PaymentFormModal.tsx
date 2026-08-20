import React from 'react';
import { Checkbox, NumberInput, Select, Stack } from '@mantine/core';
import { CurrencyCircleDollarIcon } from '@phosphor-icons/react';
import { GiftCardPaySelect } from '@/pages/gift-cards/ui/GiftCardPaySelect';
import { useCreatePayment } from '@/shared/api/hooks/usePayments';
import { useReceipts } from '@/shared/api/hooks/useReceipts';
import type { PaymentMethod } from '@/shared/api/types';
import { formatPrice, PAYMENT_METHOD_OPTIONS } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { FormModal, FormModalFooter } from '@/shared/ui';

interface PaymentFormModalProps {
  opened: boolean;
  onClose: () => void;
  initialReceiptId?: number | null;
}

export const PaymentFormModal: React.FC<PaymentFormModalProps> = ({ opened, onClose, initialReceiptId }) => {
  const { isAdmin, hasPermission } = useAccess();
  const canUseGiftCard = isAdmin || hasPermission(PermissionCode.GIFT_CARD_GET);
  const [receiptId, setReceiptId] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState(0);
  const [method, setMethod] = React.useState<PaymentMethod>('cash');
  const [giftCardId, setGiftCardId] = React.useState<string | null>(null);
  const [addChangeToDeposit, setAddChangeToDeposit] = React.useState(false);

  const { data: receipts } = useReceipts();
  const createPayment = useCreatePayment();
  const isGiftCard = method === 'gift card';
  const selectedReceipt = (receipts ?? []).find((item) => String(item.id) === receiptId) ?? null;

  const pendingReceiptOptions = React.useMemo(
    () =>
      (receipts ?? [])
        .filter((item) => item.status === 'pending')
        .map((item) => ({ value: String(item.id), label: `#${item.id} · ${formatPrice(item.remaining_amount)}` })),
    [receipts],
  );
  const methodOptions = React.useMemo(
    () => PAYMENT_METHOD_OPTIONS.filter((item) => item.value !== 'gift card' || canUseGiftCard),
    [canUseGiftCard],
  );

  useResetOnOpen(opened, () => {
    const receipt =
      initialReceiptId != null ? (receipts ?? []).find((item) => item.id === initialReceiptId) : null;
    setReceiptId(initialReceiptId != null ? String(initialReceiptId) : null);
    setAmount(receipt?.remaining_amount ?? 0);
    setMethod('cash');
    setGiftCardId(null);
    setAddChangeToDeposit(false);
  });

  const handleReceiptChange = (value: string | null) => {
    setReceiptId(value);
    setGiftCardId(null);
    const receipt = value != null ? (receipts ?? []).find((item) => String(item.id) === value) : null;
    setAmount(receipt?.remaining_amount ?? 0);
  };

  const handleSubmit = React.useCallback(() => {
    if (!receiptId || (isGiftCard && !giftCardId)) return;
    createPayment.mutate(
      {
        receipt_id: Number(receiptId),
        amount,
        method,
        giftCard_id: isGiftCard && giftCardId ? Number(giftCardId) : null,
        add_change_to_deposit: isGiftCard ? false : addChangeToDeposit,
      },
      { onSuccess: onClose },
    );
  }, [receiptId, amount, method, giftCardId, isGiftCard, addChangeToDeposit, createPayment, onClose]);

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Провести оплату"
      icon={<CurrencyCircleDollarIcon />}
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel="Оплатить"
          onSubmit={handleSubmit}
          submitDisabled={!receiptId || amount <= 0 || (isGiftCard && !giftCardId)}
          loading={createPayment.isPending}
        />
      }
    >
      <Stack gap="sm">
        <Select
          label="Чек"
          searchable
          placeholder="Выберите чек"
          data={pendingReceiptOptions}
          value={receiptId}
          onChange={handleReceiptChange}
        />
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
          data={methodOptions}
          value={method}
          onChange={(value) => {
            const next = (value as PaymentMethod) ?? 'cash';
            setMethod(next);
            if (next !== 'gift card') setGiftCardId(null);
          }}
        />
        {isGiftCard && (
          <GiftCardPaySelect
            clientId={selectedReceipt?.client_id ?? null}
            value={giftCardId}
            onChange={(id, remain) => {
              setGiftCardId(id);
              if (remain != null && selectedReceipt) {
                setAmount(Math.min(remain, selectedReceipt.remaining_amount));
              }
            }}
          />
        )}
        {!isGiftCard && (
          <Checkbox
            label="Сдачу на депозит клиента"
            checked={addChangeToDeposit}
            onChange={(event) => setAddChangeToDeposit(event.currentTarget.checked)}
          />
        )}
      </Stack>
    </FormModal>
  );
};
