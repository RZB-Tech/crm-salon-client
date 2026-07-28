import React from 'react';
import { Alert, Button, Group, Skeleton, Tabs } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { usePayments } from '@/shared/api/hooks/usePayments';
import { useReceipts } from '@/shared/api/hooks/useReceipts';
import { ListPage } from '@/shared/ui';
import { ReceiptsTab } from './tabs/ReceiptsTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { TransactionsTab } from './tabs/TransactionsTab';
import { PayoutsTab } from './tabs/PayoutsTab';
import { ReceiptFormModal } from './ReceiptFormModal';
import { PaymentFormModal } from './PaymentFormModal';

export const FinancePage: React.FC = () => {
  const [tab, setTab] = React.useState<string>('receipts');
  const [receiptFormOpen, setReceiptFormOpen] = React.useState(false);
  const [paymentFormOpen, setPaymentFormOpen] = React.useState(false);
  const [paymentReceiptId, setPaymentReceiptId] = React.useState<number | null>(null);

  const { data: receipts, isLoading: receiptsLoading, isError: receiptsError } = useReceipts();
  const { data: payments, isLoading: paymentsLoading, isError: paymentsError } = usePayments();

  const openPaymentForm = React.useCallback((receiptId?: number) => {
    setPaymentReceiptId(receiptId ?? null);
    setPaymentFormOpen(true);
  }, []);

  const isLoading = receiptsLoading || paymentsLoading;
  const isError = receiptsError || paymentsError;

  if (isLoading) {
    return (
      <ListPage title="Финансы">
        <Skeleton height={48} mb="md" />
        <Skeleton height={400} radius="md" />
      </ListPage>
    );
  }

  if (isError) {
    return (
      <ListPage title="Финансы">
        <Alert color="red" title="Не удалось загрузить финансы">
          Проверьте доступность API
        </Alert>
      </ListPage>
    );
  }

  return (
    <ListPage
      title="Финансы"
      subtitle={`${receipts?.length ?? 0} чеков · ${payments?.length ?? 0} оплат`}
      actions={
        tab !== 'transactions' && tab !== 'payouts' ? (
          <Group>
            <Button variant="light" onClick={() => openPaymentForm()}>
              Провести оплату
            </Button>
            <Button leftSection={<PlusIcon size={16} />} onClick={() => setReceiptFormOpen(true)}>
              Новый чек
            </Button>
          </Group>
        ) : undefined
      }
    >
      <Tabs value={tab} onChange={(value) => setTab(value ?? 'receipts')} variant="pills" radius="md">
        <Tabs.List mb="md">
          <Tabs.Tab value="receipts">Чеки</Tabs.Tab>
          <Tabs.Tab value="payments">Оплаты</Tabs.Tab>
          <Tabs.Tab value="transactions">Транзакции</Tabs.Tab>
          <Tabs.Tab value="payouts">Выплаты</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {tab === 'receipts' && <ReceiptsTab receipts={receipts ?? []} onPayReceipt={openPaymentForm} />}
      {tab === 'payments' && <PaymentsTab payments={payments ?? []} />}
      {tab === 'transactions' && <TransactionsTab enabled />}
      {tab === 'payouts' && <PayoutsTab enabled />}

      <ReceiptFormModal opened={receiptFormOpen} onClose={() => setReceiptFormOpen(false)} />
      <PaymentFormModal opened={paymentFormOpen} onClose={() => setPaymentFormOpen(false)} initialReceiptId={paymentReceiptId} />
    </ListPage>
  );
};
