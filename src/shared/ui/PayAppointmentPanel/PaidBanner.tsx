import React from 'react';
import { Button, Group, Stack, Text } from '@mantine/core';
import { CheckCircle } from '@phosphor-icons/react';
import type { Receipt } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import styles from './pay-appointment-panel.module.css';

interface PaidBannerProps {
  receipt: Receipt | null | undefined;
  cancelConfirmOpen: boolean;
  cancelPending: boolean;
  onOpenCancelConfirm: () => void;
  onCloseCancelConfirm: () => void;
  onConfirmCancel: () => void;
}

export const PaidBanner: React.FC<PaidBannerProps> = ({
  receipt,
  cancelConfirmOpen,
  cancelPending,
  onOpenCancelConfirm,
  onCloseCancelConfirm,
  onConfirmCancel,
}) => (
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
          onClick={onOpenCancelConfirm}
          loading={cancelPending}
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
      loading={cancelPending}
      onConfirm={onConfirmCancel}
      onClose={onCloseCancelConfirm}
    />
  </Stack>
);
