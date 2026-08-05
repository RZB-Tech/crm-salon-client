import React from 'react';
import { Button, Group, Modal, NumberInput, Select, Textarea } from '@mantine/core';
import { useCreateTransaction } from '@/shared/api/hooks/useTransactions';
import type { ManualTransactionCategory, TransactionMethod, TransactionType } from '@/shared/api/types';
import {
  MANUAL_TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_METHOD_OPTIONS,
  TRANSACTION_TYPE_OPTIONS,
} from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
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

  return (
    <Modal opened={opened} onClose={onClose} title="Новая транзакция" radius="md" size="md">
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
        <Button variant="subtle" color="gray" onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={handleSubmit} loading={createTransaction.isPending} disabled={form.amount <= 0}>
          Создать
        </Button>
      </Group>
    </Modal>
  );
};
