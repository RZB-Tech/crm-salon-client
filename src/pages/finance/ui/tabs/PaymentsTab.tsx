import React from 'react';
import { Button, Modal, Table, Text } from '@mantine/core';
import type { Transaction } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { DataTable, DataTableRow } from '@/shared/ui';
import { formatDateTime, formatPrice, PAYMENT_METHOD_LABELS } from '@/shared/lib/format';

interface PaymentsTabProps {
  payments: Transaction[];
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ payments }) => {
  const [historyPayment, setHistoryPayment] = React.useState<Transaction | null>(null);

  return (
    <>
      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'receipt', label: 'Чек' },
          { key: 'amount', label: 'Сумма' },
          { key: 'method', label: 'Способ' },
          { key: 'date', label: 'Дата' },
          { key: 'actions', label: '', width: 100 },
        ]}
        isEmpty={payments.length === 0}
        emptyMessage="Оплат нет"
      >
        {payments.map((payment) => (
          <DataTableRow key={payment.id}>
            <Table.Td>
              <Text size="sm" ff="monospace" c="dimmed">#{payment.id}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm">#{payment.receipt_id}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" fw={600}>{formatPrice(payment.amount)}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}</Text>
            </Table.Td>
            <Table.Td>
              <Text size="xs">{formatDateTime(payment.created_at)}</Text>
            </Table.Td>
            <Table.Td>
              <Button size="xs" variant="subtle" onClick={() => setHistoryPayment(payment)}>
                История
              </Button>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>

      <Modal
        opened={Boolean(historyPayment)}
        onClose={() => setHistoryPayment(null)}
        title={historyPayment ? `История оплаты #${historyPayment.id}` : 'История оплаты'}
        radius="md"
        size="md"
      >
        {historyPayment && <AuditLogsPanel tableName="payments" recordId={historyPayment.id} />}
      </Modal>
    </>
  );
};
