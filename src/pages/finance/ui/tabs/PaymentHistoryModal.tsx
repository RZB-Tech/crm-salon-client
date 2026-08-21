import React from 'react';
import { Badge } from '@mantine/core';
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Transaction } from '@/shared/api/types';
import { formatPrice, PAYMENT_METHOD_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { AuditLogsPanel, FormModal, FormModalFooter, FormSection } from '@/shared/ui';

interface PaymentHistoryModalProps {
  payment: Transaction | null;
  onClose: () => void;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ payment, onClose }) => {
  const { t } = useI18n();
  return (
    <FormModal
      opened={Boolean(payment)}
      onClose={onClose}
      title={payment ? t('form.paymentHistoryNamed', { id: payment.id }) : t('form.paymentHistory')}
      subtitle={
        payment
          ? t('form.receiptNamed', { id: payment.receipt_id ?? t('common.dash') })
          : t('form.paymentAudit')
      }
      icon={<ClockCounterClockwiseIcon size={22} />}
      headerAside={
        payment ? (
          <Badge variant="light" color="sage" radius="sm">
            {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
          </Badge>
        ) : undefined
      }
      size={567}
      footer={
        <FormModalFooter
          metaLabel={payment ? t('form.paymentAmountMeta') : undefined}
          metaValue={payment ? formatPrice(payment.amount) : undefined}
          cancelLabel={t('common.close')}
          onCancel={onClose}
        />
      }
    >
      {payment && (
        <FormSection title={t('form.changeHistory')} muted>
          <AuditLogsPanel tableName="payments" recordId={payment.id} />
        </FormSection>
      )}
    </FormModal>
  );
};
