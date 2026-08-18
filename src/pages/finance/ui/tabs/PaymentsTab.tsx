import React from 'react';
import { Box, Button, Table, Text } from '@mantine/core';
import type { Transaction } from '@/shared/api/types';
import { ListPanelBody, ListPaginationFooter, listPageStyles, SortableTh } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { sortTime, useTableSort } from '@/shared/lib/hooks/useTableSort';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { formatDateTime, formatPrice, PAYMENT_METHOD_LABELS } from '@/shared/lib/format';
import { PaymentHistoryModal } from './PaymentHistoryModal';

interface PaymentsTabProps {
  payments: Transaction[];
}

const PAYMENT_SORT_GETTERS = {
  id: (item: Transaction) => item.id,
  receipt: (item: Transaction) => item.receipt_id,
  amount: (item: Transaction) => item.amount,
  method: (item: Transaction) => item.method,
  date: (item: Transaction) => sortTime(item.created_at),
};

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ payments }) => {
  const [historyPaymentId, setHistoryPaymentId] = React.useState<number | null>(null);
  const historyPayment = useResolvedById(payments, historyPaymentId);

  const { sort, sortedItems, toggleSort } = useTableSort(payments, PAYMENT_SORT_GETTERS, {
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

  return (
    <Box className={listPageStyles.panel}>
      <ListPanelBody>
        <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
          <Table.Thead>
            <Table.Tr>
              <SortableTh column="id" sort={sort} onSort={toggleSort}>
                ID
              </SortableTh>
              <SortableTh column="receipt" sort={sort} onSort={toggleSort}>
                Чек
              </SortableTh>
              <SortableTh column="amount" sort={sort} onSort={toggleSort}>
                Сумма
              </SortableTh>
              <SortableTh column="method" sort={sort} onSort={toggleSort}>
                Способ
              </SortableTh>
              <SortableTh column="date" sort={sort} onSort={toggleSort}>
                Дата
              </SortableTh>
              <Table.Th className={listPageStyles.headCell} w={100} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedItems.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text size="sm" c="dimmed" ta="center" py="xl">
                    Оплат нет
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedItems.map((payment) => (
                <Table.Tr key={payment.id} className={listPageStyles.row}>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" ff="monospace" c="rgba(72,72,72,0.4)">
                      #{payment.id}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" c="#484848">
                      #{payment.receipt_id}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" fw={600} c="#484848">
                      {formatPrice(payment.amount)}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" c="rgba(72,72,72,0.4)">
                      {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="xs" c="rgba(72,72,72,0.4)">
                      {formatDateTime(payment.created_at)}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Button size="xs" variant="subtle" onClick={() => setHistoryPaymentId(payment.id)}>
                      История
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </ListPanelBody>

      <ListPaginationFooter
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <PaymentHistoryModal payment={historyPayment} onClose={() => setHistoryPaymentId(null)} />
    </Box>
  );
};
