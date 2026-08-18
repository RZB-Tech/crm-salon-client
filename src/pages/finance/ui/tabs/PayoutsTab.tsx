import React from 'react';
import { Box } from '@mantine/core';
import { usePayouts } from '@/shared/api/hooks/usePayouts';
import { useEmployees } from '@/shared/api/hooks/useEmployees';
import { ListPanelBody, ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { sortTime, useTableSort } from '@/shared/lib/hooks/useTableSort';
import { getEmployeeFullName } from '@/shared/lib/format';
import type { Payout } from '@/shared/api/types';
import { PayoutFormModal } from '../PayoutFormModal';
import { PayoutsTable } from './PayoutsTable';

export type PayoutsTabHandle = {
  openCreate: () => void;
};

interface PayoutsTabProps {
  enabled: boolean;
}

export const PayoutsTab = React.forwardRef<PayoutsTabHandle, PayoutsTabProps>(function PayoutsTab(
  { enabled },
  ref,
) {
  const [formOpen, setFormOpen] = React.useState(false);

  const { data: payouts } = usePayouts();
  const { data: employees } = useEmployees();

  const employeeMap = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const e of employees ?? []) map.set(e.id, getEmployeeFullName(e));
    return map;
  }, [employees]);

  const list = payouts ?? [];
  const getters = React.useMemo(
    () => ({
      id: (item: Payout) => item.id,
      employee: (item: Payout) => employeeMap.get(item.employee_id) ?? '',
      type: (item: Payout) => item.type,
      amount: (item: Payout) => item.total_amount,
      method: (item: Payout) => item.method,
      status: (item: Payout) => Number(item.cancelled),
      date: (item: Payout) => sortTime(item.created_at),
    }),
    [employeeMap],
  );
  const { sort, sortedItems, toggleSort } = useTableSort(list, getters, {
    key: 'date',
    dir: 'desc',
  });
  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } = usePagination(
    sortedItems,
    { defaultPageSize: 20 },
  );

  React.useEffect(() => {
    resetPage();
  }, [sort.key, sort.dir, resetPage]);

  const openForm = React.useCallback(() => setFormOpen(true), []);

  React.useImperativeHandle(ref, () => ({ openCreate: openForm }), [openForm]);

  if (!enabled) return null;

  return (
    <Box className={listPageStyles.panel}>
      <ListPanelBody>
        <PayoutsTable
          items={paginatedItems}
          employeeMap={employeeMap}
          sort={sort}
          onSort={toggleSort}
        />
      </ListPanelBody>

      <ListPaginationFooter
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <PayoutFormModal opened={formOpen} onClose={() => setFormOpen(false)} />
    </Box>
  );
});
