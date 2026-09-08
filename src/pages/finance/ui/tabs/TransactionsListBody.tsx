import React from 'react';
import type { Transaction } from '@/shared/api/types';
import { ListCards, ListPanelBody } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { TransactionMobileCard } from './TransactionMobileCard';
import { TransactionsTable } from './TransactionsTable';

interface TransactionsListBodyProps extends TableSortProps {
  items: Transaction[];
  onCancel: (id: number) => void;
}

export const TransactionsListBody: React.FC<TransactionsListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <TransactionsTable {...props} />;
  }

  return (
    <ListPanelBody>
      <ListCards isEmpty={props.items.length === 0} emptyMessage={t('finance.emptyTransactions')}>
        {props.items.map((transaction) => (
          <TransactionMobileCard
            key={transaction.id}
            transaction={transaction}
            onCancel={props.onCancel}
          />
        ))}
      </ListCards>
    </ListPanelBody>
  );
};
