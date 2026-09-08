import React from 'react';
import type { Receipt } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { ReceiptMobileCard } from './ReceiptMobileCard';
import { ReceiptsTable } from './ReceiptsTable';

interface ReceiptsListBodyProps extends TableSortProps {
  items: Receipt[];
  onShowHistory: (receiptId: number) => void;
  onPayReceipt: (receiptId: number) => void;
  onCancelReceipt: (receiptId: number) => void;
}

export const ReceiptsListBody: React.FC<ReceiptsListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <ReceiptsTable {...props} />;
  }

  return (
    <ListCards isEmpty={props.items.length === 0} emptyMessage={t('finance.emptyReceipts')}>
      {props.items.map((receipt) => (
        <ReceiptMobileCard
          key={receipt.id}
          receipt={receipt}
          onShowHistory={props.onShowHistory}
          onPayReceipt={props.onPayReceipt}
          onCancelReceipt={props.onCancelReceipt}
        />
      ))}
    </ListCards>
  );
};
