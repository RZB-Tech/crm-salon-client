import React from 'react';
import { Button, Checkbox, Group, NumberInput, Select, Stack, Text } from '@mantine/core';
import { useCreatePayment } from '@/shared/api/hooks/usePayments';
import { useCreateReceipt, useReceipts } from '@/shared/api/hooks/useReceipts';
import type { Appointment, PaymentMethod } from '@/shared/api/types';
import { formatPrice, PAYMENT_METHOD_OPTIONS } from '@/shared/lib/format';

interface PayAppointmentPanelProps {
  appointment: Appointment;
}

export const PayAppointmentPanel: React.FC<PayAppointmentPanelProps> = ({ appointment }) => {
  const { data: receipts } = useReceipts();
  const createReceipt = useCreateReceipt();
  const createPayment = useCreatePayment();

  const [amount, setAmount] = React.useState(appointment.total_price);
  const [method, setMethod] = React.useState<PaymentMethod>('cash');
  const [addChangeToDeposit, setAddChangeToDeposit] = React.useState(false);

  const receipt = React.useMemo(
    () =>
      (receipts ?? []).find(
        (item) =>
          item.appointment_id === appointment.id &&
          item.status !== 'cancelled',
      ),
    [receipts, appointment.id],
  );

  React.useEffect(() => {
    if (receipt) {
      setAmount(receipt.remaining_amount > 0 ? receipt.remaining_amount : receipt.total_amount);
    } else {
      setAmount(appointment.total_price);
    }
  }, [receipt, appointment.total_price]);

  const handleCreateReceipt = React.useCallback(() => {
    createReceipt.mutate({
      receipt_type: 'appointment',
      appointment_id: appointment.id,
    });
  }, [appointment.id, createReceipt]);

  const handlePay = React.useCallback(() => {
    if (!receipt) return;
    createPayment.mutate({
      receipt_id: receipt.id,
      amount,
      method,
      add_change_to_deposit: addChangeToDeposit,
    });
  }, [receipt, amount, method, addChangeToDeposit, createPayment]);

  const isPaid = appointment.paid || receipt?.status === 'paid';
  const isLoading = createReceipt.isPending || createPayment.isPending;

  if (isPaid) {
    return (
      <Stack gap="xs">
        <Text size="sm" c="green" fw={600}>
          Запись оплачена
        </Text>
        {receipt && (
          <Text size="xs" c="dimmed">
            Чек #{receipt.id} · {formatPrice(receipt.total_amount)}
          </Text>
        )}
      </Stack>
    );
  }

  return (
    <Stack gap="sm">
      <Text size="sm" fw={600}>
        Оплата · {formatPrice(appointment.total_price)}
      </Text>

      {!receipt ? (
        <Button
          variant="light"
          onClick={handleCreateReceipt}
          loading={createReceipt.isPending}
          disabled={!appointment.records?.length}
        >
          Выставить счёт
        </Button>
      ) : (
        <>
          <Text size="xs" c="dimmed">
            Чек #{receipt.id} · к оплате {formatPrice(receipt.remaining_amount)}
          </Text>
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
          <Checkbox
            label="Сдачу на депозит клиента"
            checked={addChangeToDeposit}
            onChange={(event) => setAddChangeToDeposit(event.currentTarget.checked)}
          />
          <Group justify="flex-end">
            <Button onClick={handlePay} loading={isLoading} disabled={amount <= 0}>
              Оплатить
            </Button>
          </Group>
        </>
      )}
    </Stack>
  );
};
