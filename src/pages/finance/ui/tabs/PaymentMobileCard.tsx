import React from 'react';
import { ActionIcon } from '@mantine/core';
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Transaction } from '@/shared/api/types';
import { ListCardField, ListEntityCard, listPageStyles } from '@/shared/ui';
import { formatDateTime, formatPrice, PAYMENT_METHOD_LABELS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';

interface PaymentMobileCardProps {
  payment: Transaction;
  onShowHistory: (paymentId: number) => void;
}

export const PaymentMobileCard: React.FC<PaymentMobileCardProps> = ({ payment, onShowHistory }) => {
  const { t } = useI18n();

  return (
    <ListEntityCard>
      <div className={listPageStyles.cardHeader}>
        <div className={listPageStyles.cardBadges}>
          <span className={listPageStyles.cardChip}>№{payment.id}</span>
        </div>
        <ActionIcon
          className={listPageStyles.iconBtn}
          variant="default"
          aria-label={t('finance.history')}
          onClick={() => onShowHistory(payment.id)}
        >
          <ClockCounterClockwiseIcon size={20} />
        </ActionIcon>
      </div>
      <div className={listPageStyles.cardFields}>
        <ListCardField label={t('form.receipt')} value={`№${payment.receipt_id}`} />
        <ListCardField label={t('form.amount')} value={formatPrice(payment.amount)} />
        <ListCardField
          label={t('form.methodShort')}
          value={PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
        />
      </div>
      <span className={listPageStyles.cardMeta}>{formatDateTime(payment.created_at)}</span>
    </ListEntityCard>
  );
};
