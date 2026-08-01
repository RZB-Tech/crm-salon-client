import React from 'react';
import { Alert, Box, Button, Group, Skeleton, Stack } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { useTransactions } from '@/shared/api/hooks/useTransactions';
import { useReceipts } from '@/shared/api/hooks/useReceipts';
import { ListPageShell, ListTabs } from '@/shared/ui';
import { ReceiptsTab } from './tabs/ReceiptsTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { TransactionsTab, type TransactionsTabHandle } from './tabs/TransactionsTab';
import { PayoutsTab, type PayoutsTabHandle } from './tabs/PayoutsTab';
import { ReceiptFormModal } from './ReceiptFormModal';
import { PaymentFormModal } from './PaymentFormModal';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';

export const FinancePage: React.FC = () => {
  const { hasPermission } = useAccess();
  const [tab, setTab] = React.useState<string>('receipts');
  const [receiptFormOpen, setReceiptFormOpen] = React.useState(false);
  const [paymentFormOpen, setPaymentFormOpen] = React.useState(false);
  const [paymentReceiptId, setPaymentReceiptId] = React.useState<number | null>(null);
  const transactionsRef = React.useRef<TransactionsTabHandle>(null);
  const payoutsRef = React.useRef<PayoutsTabHandle>(null);

  const { data: receipts, isLoading: receiptsLoading, isError: receiptsError } = useReceipts();
  const { data: payments, isLoading: paymentsLoading, isError: paymentsError } = useTransactions();

  const openPaymentForm = React.useCallback((receiptId?: number) => {
    setPaymentReceiptId(receiptId ?? null);
    setPaymentFormOpen(true);
  }, []);

  const isLoading = receiptsLoading || paymentsLoading;
  const isError = receiptsError || paymentsError;

  const toolbarActions = (() => {
    if (tab === 'receipts' || tab === 'payments') {
      return (
        <Group gap={8} wrap="nowrap">
          {hasPermission(PermissionCode.RECEIPT_MAKE_PAYMENT) && (
            <Button variant="light" color="sage" size="sm" onClick={() => openPaymentForm()}>
              Провести оплату
            </Button>
          )}
          {hasPermission(PermissionCode.RECEIPT_CREATE) && (
            <Button
              color="sage.7"
              rightSection={<PlusIcon size={16} />}
              size="sm"
              onClick={() => setReceiptFormOpen(true)}
            >
              Новый чек
            </Button>
          )}
        </Group>
      );
    }
    if (tab === 'transactions') {
      return (
        <Button
          color="sage.7"
          rightSection={<PlusIcon size={16} />}
          size="sm"
          onClick={() => transactionsRef.current?.openCreate()}
        >
          Новая транзакция
        </Button>
      );
    }
    if (tab === 'payouts') {
      return (
        <Button
          color="sage.7"
          rightSection={<PlusIcon size={16} />}
          size="sm"
          onClick={() => payoutsRef.current?.openCreate()}
        >
          Новая выплата
        </Button>
      );
    }
    return null;
  })();

  if (isLoading) {
    return (
      <ListPageShell
        toolbar={
          <>
            <Skeleton height={32} width={360} radius="md" />
            <Skeleton height={32} width={160} radius="md" />
          </>
        }
      >
        <Stack gap="xs" p="md">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={48} radius="sm" />
          ))}
        </Stack>
      </ListPageShell>
    );
  }

  if (isError) {
    return (
      <ListPageShell>
        <Box p="xl">
          <Alert color="red" title="Не удалось загрузить финансы">
            Проверьте доступность API
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  return (
    <ListPageShell
      toolbar={
        <>
          <ListTabs
            value={tab}
            onChange={setTab}
            data={[
              { value: 'receipts', label: 'Чеки' },
              { value: 'payments', label: 'Оплаты' },
              { value: 'transactions', label: 'Транзакции' },
              { value: 'payouts', label: 'Выплаты' },
            ]}
          />
          {toolbarActions}
        </>
      }
    >
      {tab === 'receipts' && <ReceiptsTab receipts={receipts ?? []} onPayReceipt={openPaymentForm} />}
      {tab === 'payments' && <PaymentsTab payments={payments ?? []} />}
      {tab === 'transactions' && <TransactionsTab ref={transactionsRef} enabled />}
      {tab === 'payouts' && <PayoutsTab ref={payoutsRef} enabled />}

      <ReceiptFormModal opened={receiptFormOpen} onClose={() => setReceiptFormOpen(false)} />
      <PaymentFormModal
        opened={paymentFormOpen}
        onClose={() => setPaymentFormOpen(false)}
        initialReceiptId={paymentReceiptId}
      />
    </ListPageShell>
  );
};
