import React from 'react';
import { Button, Text } from '@mantine/core';
import { Receipt as ReceiptIcon } from '@phosphor-icons/react';
import type { Appointment } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
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
}) => {
  const { t } = useI18n();
  return (
    <div className={styles.issueInvoice}>
      <p className={styles.sectionTitleMuted}>{t('finance.invoicing')}</p>
      <p className={styles.sectionHint}>{t('finance.invoiceLockHint')}</p>
      <div className={styles.issueInvoiceCard}>
        <Button
          className={styles.issueInvoiceBtn}
          leftSection={<ReceiptIcon size={16} />}
          onClick={onCreateReceipt}
          loading={createPending}
          disabled={!appointment.records?.length || appointment.total_price <= 0}
        >
          {t('finance.issueInvoice')}
        </Button>
        {cancelledReceiptsCount > 0 && (
          <Text size="xs" c="dimmed" mt="sm">
            {t('finance.cancelledReceiptsCount', { count: cancelledReceiptsCount })}
          </Text>
        )}
      </div>
    </div>
  );
};
