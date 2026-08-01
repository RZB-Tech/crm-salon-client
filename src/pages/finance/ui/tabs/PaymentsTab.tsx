import React from 'react';
import { Box, Button, Modal, Table, Text } from '@mantine/core';
import type { Transaction } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { formatDateTime, formatPrice, PAYMENT_METHOD_LABELS } from '@/shared/lib/format';

interface PaymentsTabProps {
  payments: Transaction[];
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ payments }) => {
  const [historyPayment, setHistoryPayment] = React.useState<Transaction | null>(null);

  const { page, pageSize, paginatedItems, total, setPage, setPageSize } = usePagination(payments, {
    defaultPageSize: 20,
  });

  return (
    <Box className={listPageStyles.panel}>
      <Box className={listPageStyles.panelBody}>
        <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={listPageStyles.headCell}>ID</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Чек</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Сумма</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Способ</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Дата</Table.Th>
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
                    <Button size="xs" variant="subtle" onClick={() => setHistoryPayment(payment)}>
                      История
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <ListPaginationFooter
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <Modal
        opened={Boolean(historyPayment)}
        onClose={() => setHistoryPayment(null)}
        title={historyPayment ? `История оплаты #${historyPayment.id}` : 'История оплаты'}
        radius="md"
        size="md"
      >
        {historyPayment && <AuditLogsPanel tableName="payments" recordId={historyPayment.id} />}
      </Modal>
    </Box>
  );
};
