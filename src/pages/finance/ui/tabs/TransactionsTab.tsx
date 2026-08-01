import React from 'react';
import {
  Badge,
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Skeleton,
  Table,
  Text,
  Textarea,
} from '@mantine/core';
import {
  useCancelTransaction,
  useCreateTransaction,
  useTransactions,
} from '@/shared/api/hooks/useTransactions';
import type {
  ManualTransactionCategory,
  Transaction,
  TransactionMethod,
  TransactionType,
} from '@/shared/api/types';
import { ConfirmModal, ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import {
  formatDateTime,
  formatPrice,
  MANUAL_TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_CATEGORY_LABELS,
  TRANSACTION_METHOD_LABELS,
  TRANSACTION_METHOD_OPTIONS,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_OPTIONS,
} from '@/shared/lib/format';

export type TransactionsTabHandle = {
  openCreate: () => void;
};

interface TransactionsTabProps {
  enabled: boolean;
}

interface TransactionFormState {
  type: TransactionType;
  category: ManualTransactionCategory;
  method: TransactionMethod;
  amount: number;
  notes: string;
}

const DEFAULT_FORM: TransactionFormState = {
  type: 'expense',
  category: 'other',
  method: 'cash',
  amount: 0,
  notes: '',
};

const isActiveTransaction = (transaction: Transaction): boolean => !transaction.cancelled;

const getSignedAmount = (transaction: Transaction): number =>
  transaction.type === 'income' ? transaction.amount : -transaction.amount;

export const TransactionsTab = React.forwardRef<TransactionsTabHandle, TransactionsTabProps>(
  function TransactionsTab({ enabled }, ref) {
  const [formOpen, setFormOpen] = React.useState(false);
  const [cancelTarget, setCancelTarget] = React.useState<number | null>(null);
  const [typeFilter, setTypeFilter] = React.useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<TransactionFormState>(DEFAULT_FORM);

  const { data: transactions, isLoading, isError } = useTransactions({ enabled });
  const createTransaction = useCreateTransaction();
  const cancelTransaction = useCancelTransaction();

  const categoryFilterOptions = React.useMemo(
    () =>
      Object.entries(TRANSACTION_CATEGORY_LABELS).map(([value, label]) => ({
        value,
        label,
      })),
    [],
  );

  const filteredTransactions = React.useMemo(() => {
    let items = [...(transactions ?? [])].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    if (typeFilter) {
      items = items.filter((item) => item.type === typeFilter);
    }

    if (categoryFilter) {
      items = items.filter((item) => item.category === categoryFilter);
    }

    if (sourceFilter === 'auto') {
      items = items.filter((item) => item.auto_generated);
    }

    if (sourceFilter === 'manual') {
      items = items.filter((item) => !item.auto_generated);
    }

    return items;
  }, [transactions, typeFilter, categoryFilter, sourceFilter]);

  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } = usePagination(
    filteredTransactions,
    { defaultPageSize: 20 },
  );

  React.useEffect(() => {
    resetPage();
  }, [typeFilter, categoryFilter, sourceFilter, resetPage]);

  const summary = React.useMemo(() => {
    const active = (transactions ?? []).filter(isActiveTransaction);

    const income = active
      .filter((item) => item.type === 'income')
      .reduce((sum, item) => sum + item.amount, 0);

    const expense = active
      .filter((item) => item.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);

    return { income, expense, balance: income - expense };
  }, [transactions]);

  const openForm = React.useCallback(() => {
    setForm(DEFAULT_FORM);
    setFormOpen(true);
  }, []);

  React.useImperativeHandle(ref, () => ({ openCreate: openForm }), [openForm]);

  const submitForm = React.useCallback(() => {
    if (form.amount <= 0) return;

    createTransaction.mutate(
      {
        type: form.type,
        category: form.category,
        method: form.method,
        amount: form.amount,
        notes: form.notes.trim() || null,
      },
      { onSuccess: () => setFormOpen(false) },
    );
  }, [form, createTransaction]);

  if (isLoading) {
    return (
      <Box className={listPageStyles.panel} p="md">
        <Skeleton height={72} mb="md" radius="md" />
        <Skeleton height={360} radius="md" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className={listPageStyles.panel} p="xl">
        <Text c="red">Не удалось загрузить транзакции</Text>
      </Box>
    );
  }

  return (
    <Box className={listPageStyles.panel}>
      <Box className={listPageStyles.summaryRow}>
        <Box className={listPageStyles.summaryItem}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            Доход
          </Text>
          <Text size="lg" fw={700} c="green">
            {formatPrice(summary.income)}
          </Text>
        </Box>
        <Box className={listPageStyles.summaryItem}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            Расход
          </Text>
          <Text size="lg" fw={700} c="red">
            {formatPrice(summary.expense)}
          </Text>
        </Box>
        <Box className={listPageStyles.summaryItem}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            Баланс
          </Text>
          <Text size="lg" fw={700} c={summary.balance >= 0 ? 'green' : 'red'}>
            {formatPrice(summary.balance)}
          </Text>
        </Box>
      </Box>

      <Box className={listPageStyles.panelToolbar}>
        <Group gap="sm" wrap="wrap">
          <Select
            placeholder="Тип"
            clearable
            w={140}
            size="sm"
            data={TRANSACTION_TYPE_OPTIONS}
            value={typeFilter}
            onChange={setTypeFilter}
          />
          <Select
            placeholder="Категория"
            clearable
            searchable
            w={180}
            size="sm"
            data={categoryFilterOptions}
            value={categoryFilter}
            onChange={setCategoryFilter}
          />
          <Select
            placeholder="Источник"
            clearable
            w={160}
            size="sm"
            data={[
              { value: 'auto', label: 'Автоматические' },
              { value: 'manual', label: 'Ручные' },
            ]}
            value={sourceFilter}
            onChange={setSourceFilter}
          />
        </Group>
      </Box>

      <Box className={listPageStyles.panelBody}>
        <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={listPageStyles.headCell}>ID</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Тип</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Категория</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Сумма</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Способ</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Связь</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Статус</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Дата</Table.Th>
              <Table.Th className={listPageStyles.headCell} w={100} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedItems.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={9}>
                  <Text size="sm" c="dimmed" ta="center" py="xl">
                    Транзакций нет
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedItems.map((transaction) => {
                const cancelled = Boolean(transaction.cancelled);
                const canCancel = !transaction.auto_generated && !cancelled;

                return (
                  <Table.Tr
                    key={transaction.id}
                    className={`${listPageStyles.row}${cancelled ? ` ${listPageStyles.mutedRow}` : ''}`}
                  >
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Text size="sm" ff="monospace" c="rgba(72,72,72,0.4)">
                        #{transaction.id}
                      </Text>
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Badge
                        size="sm"
                        variant="light"
                        color={transaction.type === 'income' ? 'green' : 'red'}
                      >
                        {TRANSACTION_TYPE_LABELS[transaction.type] ?? transaction.type}
                      </Badge>
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Text size="sm" c="#484848">
                        {TRANSACTION_CATEGORY_LABELS[transaction.category] ?? transaction.category}
                      </Text>
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Text
                        size="sm"
                        fw={600}
                        c={transaction.type === 'income' ? 'green' : 'red'}
                        td={cancelled ? 'line-through' : undefined}
                      >
                        {formatPrice(Math.abs(getSignedAmount(transaction)))}
                      </Text>
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Text size="sm" c="rgba(72,72,72,0.4)">
                        {TRANSACTION_METHOD_LABELS[transaction.method] ?? transaction.method}
                      </Text>
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      {transaction.receipt_id != null && (
                        <Text size="xs">Чек #{transaction.receipt_id}</Text>
                      )}
                      {transaction.payout_id != null && (
                        <Text size="xs">Выплата #{transaction.payout_id}</Text>
                      )}
                      {transaction.receipt_id == null && transaction.payout_id == null && (
                        <Text size="xs" c="dimmed">
                          —
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Group gap={6}>
                        {transaction.auto_generated ? (
                          <Badge size="xs" variant="outline" color="sage">
                            Авто
                          </Badge>
                        ) : (
                          <Badge size="xs" variant="outline" color="gray">
                            Ручная
                          </Badge>
                        )}
                        {cancelled && (
                          <Badge size="xs" variant="light" color="gray">
                            Отменена
                          </Badge>
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      <Text size="xs" c="rgba(72,72,72,0.4)">
                        {formatDateTime(transaction.created_at)}
                      </Text>
                      {transaction.notes && (
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {transaction.notes}
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td className={listPageStyles.bodyCell}>
                      {canCancel && (
                        <Button
                          size="xs"
                          variant="subtle"
                          color="red"
                          onClick={() => setCancelTarget(transaction.id)}
                        >
                          Отменить
                        </Button>
                      )}
                    </Table.Td>
                  </Table.Tr>
                );
              })
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
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title="Новая транзакция"
        radius="md"
        size="md"
      >
        <Select
          label="Тип"
          mb="md"
          data={TRANSACTION_TYPE_OPTIONS}
          value={form.type}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, type: (value as TransactionType) ?? 'expense' }))
          }
        />
        <Select
          label="Категория"
          mb="md"
          data={[...MANUAL_TRANSACTION_CATEGORY_OPTIONS]}
          value={form.category}
          onChange={(value) =>
            setForm((prev) => ({
              ...prev,
              category: (value as ManualTransactionCategory) ?? 'other',
            }))
          }
        />
        <Select
          label="Способ оплаты"
          mb="md"
          data={TRANSACTION_METHOD_OPTIONS}
          value={form.method}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, method: (value as TransactionMethod) ?? 'cash' }))
          }
        />
        <NumberInput
          label="Сумма"
          min={1}
          mb="md"
          value={form.amount}
          onChange={(value) => setForm((prev) => ({ ...prev, amount: Number(value) || 0 }))}
          thousandSeparator=" "
          suffix=" сум"
        />
        <Textarea
          label="Примечание"
          mb="lg"
          minRows={2}
          value={form.notes}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, notes: event.currentTarget.value }))
          }
        />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={() => setFormOpen(false)}>
            Отмена
          </Button>
          <Button
            onClick={submitForm}
            loading={createTransaction.isPending}
            disabled={form.amount <= 0}
          >
            Создать
          </Button>
        </Group>
      </Modal>

      <ConfirmModal
        opened={cancelTarget != null}
        title="Отменить транзакцию"
        message="Отменить эту транзакцию? Действие необратимо."
        loading={cancelTransaction.isPending}
        onConfirm={() =>
          cancelTarget != null &&
          cancelTransaction.mutate(cancelTarget, { onSuccess: () => setCancelTarget(null) })
        }
        onClose={() => setCancelTarget(null)}
      />
    </Box>
  );
});
