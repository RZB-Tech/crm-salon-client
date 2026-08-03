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
import { CheckCircle, Receipt as ReceiptIcon, Wallet } from '@phosphor-icons/react';
import { useCreatePayment } from '@/shared/api/hooks/usePayments';
import { useAppointmentReceipts } from '@/shared/api/hooks/useAppointments';
import { useCancelReceipt, useCreateReceipt } from '@/shared/api/hooks/useReceipts';
import type { Appointment, PaymentMethod } from '@/shared/api/types';
import {
  formatPrice,
  PAYMENT_METHOD_OPTIONS,
  RECEIPT_STATUS_LABELS,
} from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import styles from './pay-appointment-panel.module.css';

interface PayAppointmentPanelProps {
  appointment: Appointment;
}

export const PayAppointmentPanel: React.FC<PayAppointmentPanelProps> = ({ appointment }) => {
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

  const isPaid = appointment.paid || receipt?.status === 'paid';
  const isLoading =
    createReceipt.isPending || createPayment.isPending || cancelReceipt.isPending || receiptsLoading;

  const step1Done = Boolean(appointment.records?.length);
  const step2Done = Boolean(receipt);
  const step3Done = isPaid;

  if (isPaid) {
    return (
      <Stack gap="md">
        <div className={styles.paidBanner}>
          <div>
            <Group gap={8} mb={4}>
              <CheckCircle size={18} color="var(--mantine-color-teal-7)" />
              <Text size="sm" fw={700} c="teal.8">
                Оплачено полностью
              </Text>
            </Group>
            {receipt && (
              <Text size="xs" c="dimmed">
                Чек #{receipt.id} · {formatPrice(receipt.total_amount)}
              </Text>
            )}
          </div>
          {receipt && (
            <Button
              variant="light"
              color="orange"
              size="xs"
              onClick={() => setCancelConfirmOpen(true)}
              loading={cancelReceipt.isPending}
            >
              Отменить чек
            </Button>
          )}
        </div>
        <ConfirmModal
          opened={cancelConfirmOpen}
          title="Отменить чек"
          message="Отмена чека снимет оплату с записи и позволит снова менять состав услуг. Транзакции по чеку будут отменены."
          confirmLabel="Отменить чек"
          loading={cancelReceipt.isPending}
          onConfirm={handleCancelReceipt}
          onClose={() => setCancelConfirmOpen(false)}
        />
      </Stack>
    );
  }

  return (
    <Stack gap="sm">
      <div className={styles.payHero}>
        <div>
          <div className={styles.payHeroLabel}>К оплате</div>
          <div className={styles.payHeroAmount}>
            {formatPrice(receipt?.remaining_amount ?? appointment.total_price)}
          </div>
          {receipt && receipt.paid_amount > 0 && (
            <Text size="xs" c="dimmed" mt={4}>
              Уже оплачено {formatPrice(receipt.paid_amount)} из {formatPrice(receipt.total_amount)}
            </Text>
          )}
        </div>
        <Wallet size={28} color="var(--mantine-color-sage-7)" />
      </div>

      <div className={styles.paySteps}>
        <span className={`${styles.payStep} ${step1Done ? styles.payStepDone : styles.payStepActive}`}>
          1. Состав
        </span>
        <span
          className={`${styles.payStep} ${
            step2Done ? styles.payStepDone : step1Done ? styles.payStepActive : ''
          }`}
        >
          2. Чек
        </span>
        <span
          className={`${styles.payStep} ${
            step3Done ? styles.payStepDone : step2Done ? styles.payStepActive : ''
          }`}
        >
          3. Оплата
        </span>
      </div>

      {!appointment.records?.length && (
        <Alert color="orange" variant="light" title="Нет позиций">
          Вернитесь на вкладку «Запись» и добавьте услугу или товар.
        </Alert>
      )}

      {!receipt ? (
        <div className={styles.sectionCardMuted}>
          <p className={styles.sectionTitleMuted}>Выставить счёт</p>
          <p className={styles.sectionHint}>
            После чека состав записи блокируется до отмены оплаты.
          </p>
          <Button
            leftSection={<ReceiptIcon size={16} />}
            onClick={handleCreateReceipt}
            loading={createReceipt.isPending}
            disabled={!appointment.records?.length || appointment.total_price <= 0}
          >
            Выставить счёт
          </Button>
          {cancelledReceipts.length > 0 && (
            <Text size="xs" c="dimmed" mt="sm">
              Ранее отменённых чеков: {cancelledReceipts.length}
            </Text>
          )}
        </div>
      ) : (
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
              onClick={() => setCancelConfirmOpen(true)}
              loading={cancelReceipt.isPending}
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
                onChange={(value) => setAmount(Number(value) || 0)}
                thousandSeparator=" "
                suffix=" сум"
              />
              <Select
                label="Способ оплаты"
                data={PAYMENT_METHOD_OPTIONS}
                value={method}
                onChange={(value) => setMethod((value as PaymentMethod) ?? 'cash')}
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
                onChange={(event) => setAddChangeToDeposit(event.currentTarget.checked)}
              />
              {overpay && !addChangeToDeposit && (
                <Alert color="red" variant="light">
                  При переплате включите зачисление сдачи на депозит
                </Alert>
              )}
              <Group justify="flex-end">
                <Button onClick={handlePay} loading={isLoading} disabled={!canPay}>
                  Принять оплату
                </Button>
              </Group>
            </Stack>
          )}
        </div>
      )}

      <ConfirmModal
        opened={cancelConfirmOpen}
        title="Отменить чек"
        message="После отмены чека можно снова менять состав записи. Уже проведённые платежи будут отменены."
        confirmLabel="Отменить чек"
        loading={cancelReceipt.isPending}
        onConfirm={handleCancelReceipt}
        onClose={() => setCancelConfirmOpen(false)}
      />
    </Stack>
  );
};
