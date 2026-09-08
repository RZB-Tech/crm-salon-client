import React from 'react';
import { ActionIcon } from '@mantine/core';
import { XIcon } from '@phosphor-icons/react';
import type { Transaction } from '@/shared/api/types';
import { ListCardField, ListEntityCard, listPageStyles } from '@/shared/ui';
import {
  formatDateTime,
  formatPrice,
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_METHOD_LABELS,
  TRANSACTION_TYPE_LABELS,
} from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { getSignedAmount } from '../../lib/transactionHelpers';

interface TransactionMobileCardProps {
  transaction: Transaction;
  onCancel: (id: number) => void;
}

export const TransactionMobileCard: React.FC<TransactionMobileCardProps> = ({
  transaction,
  onCancel,
}) => {
  const { t } = useI18n();
  const cancelled = Boolean(transaction.cancelled);
  const canCancel = !transaction.auto_generated && !cancelled;
  const typeClass =
    transaction.type === 'income' ? listPageStyles.cardChipSuccess : listPageStyles.cardChipDanger;
  const link =
    transaction.receipt_id != null
      ? t('form.receiptNamed', { id: transaction.receipt_id })
      : transaction.payout_id != null
        ? t('finance.payoutNamed', { id: transaction.payout_id })
        : t('common.dash');

  return (
    <ListEntityCard>
      <div className={listPageStyles.cardHeader}>
        <div className={listPageStyles.cardBadges}>
          <span className={listPageStyles.cardChip}>№{transaction.id}</span>
          <span className={`${listPageStyles.cardChip} ${typeClass}`}>
            {TRANSACTION_TYPE_LABELS[transaction.type] ?? transaction.type}
          </span>
          <span className={listPageStyles.cardChip}>
            {transaction.auto_generated ? t('finance.auto') : t('finance.manual')}
          </span>
        </div>
        {canCancel && (
          <ActionIcon
            className={listPageStyles.iconBtn}
            variant="default"
            color="red"
            aria-label={t('common.cancel')}
            onClick={() => onCancel(transaction.id)}
          >
            <XIcon size={16} />
          </ActionIcon>
        )}
      </div>
      <div className={listPageStyles.cardFields}>
        <ListCardField
          label={t('form.category')}
          value={TRANSACTION_CATEGORY_LABELS[transaction.category] ?? transaction.category}
        />
        <ListCardField
          label={t('form.amount')}
          value={formatPrice(Math.abs(getSignedAmount(transaction)))}
        />
        <ListCardField
          label={t('form.methodShort')}
          value={TRANSACTION_METHOD_LABELS[transaction.method] ?? transaction.method}
        />
        <ListCardField label={t('finance.link')} value={link} />
      </div>
      <span className={listPageStyles.cardMeta}>{formatDateTime(transaction.created_at)}</span>
    </ListEntityCard>
  );
};
