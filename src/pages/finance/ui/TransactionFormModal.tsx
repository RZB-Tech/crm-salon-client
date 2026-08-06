import React from 'react';
import { Badge, NumberInput, Select, Textarea } from '@mantine/core';
import { ArrowsLeftRightIcon } from '@phosphor-icons/react';
import { useCreateTransaction } from '@/shared/api/hooks/useTransactions';
import type { ManualTransactionCategory, TransactionMethod, TransactionType } from '@/shared/api/types';
import {
  formatPrice,
  MANUAL_TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_METHOD_OPTIONS,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_OPTIONS,
} from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import { DEFAULT_FORM, type TransactionFormState } from '../lib/transactionHelpers';

interface TransactionFormModalProps {
  opened: boolean;
  onClose: () => void;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ opened, onClose }) => {
  const [form, setForm] = React.useState<TransactionFormState>(DEFAULT_FORM);
  const createTransaction = useCreateTransaction();

  useResetOnOpen(opened, () => setForm(DEFAULT_FORM));

  const handleSubmit = React.useCallback(() => {
    if (form.amount <= 0) return;

    createTransaction.mutate(
      {
        type: form.type,
        category: form.category,
        method: form.method,
        amount: form.amount,
        notes: form.notes.trim() || null,
      },
      { onSuccess: onClose },
    );
  }, [form, createTransaction, onClose]);

  const isIncome = form.type === 'income';

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Новая транзакция"
      subtitle="Ручная запись дохода или расхода по кассе"
      icon={<ArrowsLeftRightIcon size={22} />}
      headerAside={
        <Badge variant="light" color={isIncome ? 'teal' : 'red'} radius="sm">
          {TRANSACTION_TYPE_LABELS[form.type]}
        </Badge>
      }
      size="lg"
      footer={
        <FormModalFooter
          metaLabel="Сумма"
          metaValue={formatPrice(form.amount)}
          onCancel={onClose}
          submitLabel="Создать"
          submitColor={isIncome ? undefined : 'red'}
          onSubmit={handleSubmit}
          submitDisabled={form.amount <= 0}
          loading={createTransaction.isPending}
        />
      }
    >
      <FormSection title="Транзакция">
        <FormFieldGrid cols={2}>
          <Select
            label="Тип"
            data={TRANSACTION_TYPE_OPTIONS}
            value={form.type}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, type: (value as TransactionType) ?? 'expense' }))
            }
          />
          <Select
            label="Категория"
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
            data={TRANSACTION_METHOD_OPTIONS}
            value={form.method}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, method: (value as TransactionMethod) ?? 'cash' }))
            }
          />
          <NumberInput
            label="Сумма"
            min={1}
            value={form.amount}
            onChange={(value) => setForm((prev) => ({ ...prev, amount: Number(value) || 0 }))}
            thousandSeparator=" "
            suffix=" сум"
          />
        </FormFieldGrid>
      </FormSection>

      <FormSection title="Комментарий" muted>
        <Textarea
          placeholder="Назначение платежа, детали операции…"
          minRows={2}
          autosize
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.currentTarget.value }))}
        />
      </FormSection>
    </FormModal>
  );
};
