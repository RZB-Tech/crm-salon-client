import React from 'react';
import type { Payout } from '@/shared/api/types';
import { ListCards } from '@/shared/ui';
import type { TableSortProps } from '@/shared/lib/hooks/useTableSort';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { PayoutMobileCard } from './PayoutMobileCard';
import { PayoutsTable } from './PayoutsTable';

interface PayoutsListBodyProps extends TableSortProps {
  items: Payout[];
  employeeMap: Map<number, string>;
}

export const PayoutsListBody: React.FC<PayoutsListBodyProps> = (props) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <PayoutsTable {...props} />;
  }

  return (
    <ListCards isEmpty={props.items.length === 0} emptyMessage={t('finance.emptyPayouts')}>
      {props.items.map((payout) => (
        <PayoutMobileCard
          key={payout.id}
          payout={payout}
          employeeName={props.employeeMap.get(payout.employee_id) ?? `#${payout.employee_id}`}
        />
      ))}
    </ListCards>
  );
};
