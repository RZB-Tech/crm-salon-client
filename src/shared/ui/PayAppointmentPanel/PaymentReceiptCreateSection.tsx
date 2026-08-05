import React from 'react';
import { Button, Text } from '@mantine/core';
import { Receipt as ReceiptIcon } from '@phosphor-icons/react';
import type { Appointment } from '@/shared/api/types';
import styles from './pay-appointment-panel.module.css';

interface PaymentReceiptCreateSectionProps {
  appointment: Appointment;
  cancelledReceiptsCount: number;
  createPending: boolean;
  onCreateReceipt: () => void;
}

export const PaymentReceiptCreateSection: React.FC<PaymentReceiptCreateSectionProps> = ({
  appointment,
  cancelledReceiptsCount,
  createPending,
  onCreateReceipt,
}) => (
  <div className={styles.sectionCardMuted}>
    <p className={styles.sectionTitleMuted}>Выставить счёт</p>
    <p className={styles.sectionHint}>
      После чека состав записи блокируется до отмены оплаты.
    </p>
    <Button
      leftSection={<ReceiptIcon size={16} />}
      onClick={onCreateReceipt}
      loading={createPending}
      disabled={!appointment.records?.length || appointment.total_price <= 0}
    >
      Выставить счёт
    </Button>
    {cancelledReceiptsCount > 0 && (
      <Text size="xs" c="dimmed" mt="sm">
        Ранее отменённых чеков: {cancelledReceiptsCount}
      </Text>
    )}
  </div>
);
