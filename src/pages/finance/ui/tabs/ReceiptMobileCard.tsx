import React from 'react';
import { ActionIcon, Button, Group } from '@mantine/core';
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react';
import type { Receipt } from '@/shared/api/types';
import { ListCardField, ListEntityCard, listPageStyles } from '@/shared/ui';
import {
  formatDateTime,
  formatPrice,
  RECEIPT_STATUS_LABELS,
  RECEIPT_TYPE_LABELS,
} from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';

interface ReceiptMobileCardProps {
  receipt: Receipt;
  onShowHistory: (receiptId: number) => void;
  onPayReceipt: (receiptId: number) => void;
  onCancelReceipt: (receiptId: number) => void;
}

const statusClass = (status: Receipt['status']): string => {
  if (status === 'paid') return listPageStyles.cardChipSuccess;
  if (status === 'cancelled') return listPageStyles.cardChipDanger;
  return listPageStyles.cardChipMuted;
};

export const ReceiptMobileCard: React.FC<ReceiptMobileCardProps> = ({
  receipt,
  onShowHistory,
  onPayReceipt,
  onCancelReceipt,
}) => {
  const { t } = useI18n();
  const pending = receipt.status === 'pending';

  return (
    <ListEntityCard>
      <div className={listPageStyles.cardHeader}>
        <div className={listPageStyles.cardBadges}>
          <span className={listPageStyles.cardChip}>№{receipt.id}</span>
          <span className={`${listPageStyles.cardChip} ${statusClass(receipt.status)}`}>
            {RECEIPT_STATUS_LABELS[receipt.status] ?? receipt.status}
          </span>
        </div>
        <ActionIcon
          className={listPageStyles.iconBtn}
          variant="default"
          aria-label={t('finance.history')}
          onClick={() => onShowHistory(receipt.id)}
        >
          <ClockCounterClockwiseIcon size={20} />
        </ActionIcon>
      </div>
      <div className={listPageStyles.cardFields}>
        <ListCardField
          label={t('form.type')}
          value={RECEIPT_TYPE_LABELS[receipt.receipt_type] ?? receipt.receipt_type}
        />
        <ListCardField label={t('form.amount')} value={formatPrice(receipt.total_amount)} />
        <ListCardField label={t('giftCards.remainder')} value={formatPrice(receipt.remaining_amount)} />
      </div>
      <span className={listPageStyles.cardMeta}>{formatDateTime(receipt.created_at)}</span>
      {pending && (
        <Group gap={8}>
          <Button size="xs" variant="light" color="sage" onClick={() => onPayReceipt(receipt.id)}>
            {t('finance.pay')}
          </Button>
          <Button size="xs" variant="subtle" color="red" onClick={() => onCancelReceipt(receipt.id)}>
            {t('common.cancel')}
          </Button>
        </Group>
      )}
    </ListEntityCard>
  );
};
