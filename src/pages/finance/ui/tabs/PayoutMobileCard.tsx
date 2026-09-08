import React from 'react';
import type { Payout } from '@/shared/api/types';
import { ListCardField, ListEntityCard, listPageStyles } from '@/shared/ui';
import { formatDateTime, formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { PAYOUT_TYPE_LABELS } from '../../lib/payoutHelpers';

interface PayoutMobileCardProps {
  payout: Payout;
  employeeName: string;
}

export const PayoutMobileCard: React.FC<PayoutMobileCardProps> = ({ payout, employeeName }) => {
  const { t } = useI18n();
  const statusClass = payout.cancelled
    ? listPageStyles.cardChipDanger
    : listPageStyles.cardChipSuccess;

  return (
    <ListEntityCard>
      <div className={listPageStyles.cardHeader}>
        <div className={listPageStyles.cardBadges}>
          <span className={listPageStyles.cardChip}>№{payout.id}</span>
          <span className={`${listPageStyles.cardChip} ${statusClass}`}>
            {payout.cancelled ? t('finance.cancelled') : t('finance.completed')}
          </span>
        </div>
      </div>
      <div className={listPageStyles.cardFields}>
        <ListCardField label={t('form.employee')} value={employeeName} />
        <ListCardField label={t('form.type')} value={PAYOUT_TYPE_LABELS[payout.type] ?? payout.type} />
        <ListCardField label={t('form.amount')} value={formatPrice(payout.total_amount)} />
        <ListCardField
          label={t('form.methodShort')}
          value={payout.method === 'cash' ? t('labels.payment.cash') : t('labels.payment.card')}
        />
      </div>
      <span className={listPageStyles.cardMeta}>{formatDateTime(payout.created_at)}</span>
    </ListEntityCard>
  );
};
