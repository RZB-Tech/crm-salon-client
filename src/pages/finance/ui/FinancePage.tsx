import React from 'react';
import { Alert, Box, Skeleton, Stack } from '@mantine/core';
import { useTransactions } from '@/shared/api/hooks/useTransactions';
import { useReceipts } from '@/shared/api/hooks/useReceipts';
import { ListCreateFab, ListPageShell } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { ReceiptsTab } from './tabs/ReceiptsTab';
import { PaymentsTab } from './tabs/PaymentsTab';
import { TransactionsTab, type TransactionsTabHandle } from './tabs/TransactionsTab';
import { PayoutsTab, type PayoutsTabHandle } from './tabs/PayoutsTab';
import { ReceiptFormModal } from './ReceiptFormModal';
import { PaymentFormModal } from './PaymentFormModal';
import { FinanceToolbar } from './FinanceToolbar';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useI18n } from '@/shared/lib/i18n';

export const FinancePage: React.FC = () => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
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

  const openCreateReceipt = React.useCallback(() => setReceiptFormOpen(true), []);
  const openCreateTransaction = React.useCallback(() => transactionsRef.current?.openCreate(), []);
  const openCreatePayout = React.useCallback(() => payoutsRef.current?.openCreate(), []);

  const canPay = hasPermission(PermissionCode.RECEIPT_MAKE_PAYMENT);
  const canCreateReceipt = hasPermission(PermissionCode.RECEIPT_CREATE);
  const canCreateTransaction = hasPermission(PermissionCode.TRANSACTION_CREATE);
  const canCreatePayout = hasPermission(PermissionCode.PAYOUT_CREATE);

  const fab = React.useMemo(() => {
    if (!isMobile) return undefined;
    if ((tab === 'receipts' || tab === 'payments') && canCreateReceipt) {
      return <ListCreateFab label={t('form.newReceipt')} onClick={openCreateReceipt} />;
    }
    if (tab === 'transactions' && canCreateTransaction) {
      return <ListCreateFab label={t('form.newTransaction')} onClick={openCreateTransaction} />;
    }
    if (tab === 'payouts' && canCreatePayout) {
      return <ListCreateFab label={t('form.newPayout')} onClick={openCreatePayout} />;
    }
    return undefined;
  }, [
    isMobile,
    tab,
    canCreateReceipt,
    canCreateTransaction,
    canCreatePayout,
    t,
    openCreateReceipt,
    openCreateTransaction,
    openCreatePayout,
  ]);

  const isLoading = receiptsLoading || paymentsLoading;
  const isError = receiptsError || paymentsError;

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
          <Alert color="red" title={t('finance.loadError')}>
            {t('common.checkApi')}
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  return (
    <ListPageShell
      toolbar={
        <FinanceToolbar
          tab={tab}
          onTabChange={setTab}
          isMobile={isMobile}
          canPay={canPay}
          canCreateReceipt={canCreateReceipt}
          canCreateTransaction={canCreateTransaction}
          canCreatePayout={canCreatePayout}
          onPay={() => openPaymentForm()}
          onCreateReceipt={openCreateReceipt}
          onCreateTransaction={openCreateTransaction}
          onCreatePayout={openCreatePayout}
        />
      }
      fab={fab}
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
