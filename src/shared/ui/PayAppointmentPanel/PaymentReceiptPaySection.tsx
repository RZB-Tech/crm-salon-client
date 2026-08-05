import React from 'react';
import {
  Alert,
  Button,
  Checkbox,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import type { PaymentMethod, Receipt } from '@/shared/api/types';
import { PAYMENT_METHOD_OPTIONS, RECEIPT_STATUS_LABELS } from '@/shared/lib/format';
import styles from './pay-appointment-panel.module.css';

interface PaymentReceiptPaySectionProps {
  receipt: Receipt;
  amount: number;
  method: PaymentMethod;
  addChangeToDeposit: boolean;
  overpay: boolean;
  canPay: boolean;
  cancelPending: boolean;
  payPending: boolean;
  onAmountChange: (value: number) => void;
  onMethodChange: (value: PaymentMethod) => void;
  onAddChangeToDepositChange: (value: boolean) => void;
  onPay: () => void;
  onOpenCancelConfirm: () => void;
}

export const PaymentReceiptPaySection: React.FC<PaymentReceiptPaySectionProps> = ({
  receipt,
  amount,
  method,
  addChangeToDeposit,
  overpay,
  canPay,
  cancelPending,
  payPending,
  onAmountChange,
  onMethodChange,
  onAddChangeToDepositChange,
  onPay,
  onOpenCancelConfirm,
}) => (
  <div className={styles.sectionCard}>
    <Group justify="space-between" mb="sm">
      <div>
        <p className={styles.sectionTitle} style={{ marginBottom: 4 }}>
          Чек #{receipt.id}
        </p>
        <Text size="xs" c="dimmed">
          {RECEIPT_STATUS_LABELS[receipt.status] ?? receipt.status}
        </Text>
      </div>
      <Button
        variant="subtle"
        color="orange"
        size="xs"
        onClick={onOpenCancelConfirm}
        loading={cancelPending}
      >
        Отменить чек
      </Button>
    </Group>

    {receipt.remaining_amount > 0 && (
      <Stack gap="sm">
        <NumberInput
          label="Сумма платежа"
          description="Можно оплатить частями"
          min={1}
          value={amount}
          onChange={(value) => onAmountChange(Number(value) || 0)}
          thousandSeparator=" "
          suffix=" сум"
        />
        <Select
          label="Способ оплаты"
          data={PAYMENT_METHOD_OPTIONS}
          value={method}
          onChange={(value) => onMethodChange((value as PaymentMethod) ?? 'cash')}
          allowDeselect={false}
        />
        <Checkbox
          label="Сдачу на депозит клиента"
          description={
            overpay
              ? 'Обязательно при сумме больше остатка'
              : 'Если клиент дал больше — разница уйдёт на депозит'
          }
          checked={addChangeToDeposit}
          onChange={(event) => onAddChangeToDepositChange(event.currentTarget.checked)}
        />
        {overpay && !addChangeToDeposit && (
          <Alert color="red" variant="light">
            При переплате включите зачисление сдачи на депозит
          </Alert>
        )}
        <Group justify="flex-end">
          <Button onClick={onPay} loading={payPending} disabled={!canPay}>
            Принять оплату
          </Button>
        </Group>
      </Stack>
    )}
  </div>
);
