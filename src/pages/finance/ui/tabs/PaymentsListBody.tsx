import React from 'react';
import type { Transaction } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { PaymentMobileCard } from './PaymentMobileCard';
import { PaymentsTable } from './PaymentsTable';

interface PaymentsListBodyProps extends TableSortProps {
  items: Transaction[];
  onShowHistory: (paymentId: number) => void;
}

export const PaymentsListBody: React.FC<PaymentsListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <PaymentsTable {...props} />;
  }

  return (
    <ListCards isEmpty={props.items.length === 0} emptyMessage={t('finance.emptyPayments')}>
      {props.items.map((payment) => (
        <PaymentMobileCard
          key={payment.id}
          payment={payment}
          onShowHistory={props.onShowHistory}
        />
      ))}
    </ListCards>
  );
};
