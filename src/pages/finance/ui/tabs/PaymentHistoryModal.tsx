import React from 'react';
import { Badge } from '@mantine/core';
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Transaction } from '@/shared/api/types';
import { formatPrice, PAYMENT_METHOD_LABELS } from '@/shared/lib/format';
import { AuditLogsPanel, FormModal, FormModalFooter, FormSection } from '@/shared/ui';

interface PaymentHistoryModalProps {
  payment: Transaction | null;
  onClose: () => void;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({ payment, onClose }) => (
  <FormModal
    opened={Boolean(payment)}
    onClose={onClose}
    title={payment ? `История оплаты #${payment.id}` : 'История оплаты'}
    subtitle={payment ? `Чек #${payment.receipt_id}` : 'Аудит изменений оплаты'}
    icon={<ClockCounterClockwiseIcon size={22} />}
    headerAside={
      payment ? (
        <Badge variant="light" color="sage" radius="sm">
          {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
        </Badge>
      ) : undefined
    }
    size="lg"
    footer={
      <FormModalFooter
        metaLabel={payment ? 'Сумма оплаты' : undefined}
        metaValue={payment ? formatPrice(payment.amount) : undefined}
        cancelLabel="Закрыть"
        onCancel={onClose}
      />
    }
  >
    {payment && (
      <FormSection title="История изменений" muted>
        <AuditLogsPanel tableName="payments" recordId={payment.id} />
      </FormSection>
    )}
  </FormModal>
);
