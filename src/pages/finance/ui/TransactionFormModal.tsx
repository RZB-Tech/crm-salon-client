import React from 'react';
import { Badge, NumberInput, Select, Textarea } from '@mantine/core';
import { ArrowsLeftRightIcon } from '@phosphor-icons/react';
import { useCreateTransaction } from '@/shared/api/hooks/useTransactions';
import type { ManualTransactionCategory, TransactionMethod, TransactionType } from '@/shared/api/types';
import {
  MANUAL_TRANSACTION_CATEGORY_OPTIONS,
  TRANSACTION_METHOD_OPTIONS,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_OPTIONS,
} from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormFieldGrid, FormModal, FormModalFooter } from '@/shared/ui';
import { DEFAULT_FORM, type TransactionFormState } from '../lib/transactionHelpers';

interface TransactionFormModalProps {
  opened: boolean;
  onClose: () => void;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({ opened, onClose }) => {
  const { t } = useI18n();
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
      title={t('form.newTransaction')}
      icon={<ArrowsLeftRightIcon />}
      badges={
        <Badge variant="light" color={isIncome ? 'teal' : 'red'} radius="sm">
          {TRANSACTION_TYPE_LABELS[form.type]}
        </Badge>
      }
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('form.createTransaction')}
          submitColor={isIncome ? undefined : 'red'}
          onSubmit={handleSubmit}
          submitDisabled={form.amount <= 0}
          loading={createTransaction.isPending}
        />
      }
    >
      <FormFieldGrid cols={2}>
          <Select
            label={t('form.type')}
            data={TRANSACTION_TYPE_OPTIONS()}
            value={form.type}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, type: (value as TransactionType) ?? 'expense' }))
            }
          />
          <Select
            label={t('form.category')}
            data={[...MANUAL_TRANSACTION_CATEGORY_OPTIONS()]}
            value={form.category}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                category: (value as ManualTransactionCategory) ?? 'other',
              }))
            }
          />
          <Select
            label={t('form.method')}
            data={TRANSACTION_METHOD_OPTIONS()}
            value={form.method}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, method: (value as TransactionMethod) ?? 'cash' }))
            }
          />
          <NumberInput
            label={t('form.amount')}
            min={1}
            value={form.amount}
            onChange={(value) => setForm((prev) => ({ ...prev, amount: Number(value) || 0 }))}
            thousandSeparator=" "
            suffix={` ${t('common.currency')}`}
          />
      </FormFieldGrid>

      <Textarea
        label={t('common.comment')}
        placeholder={t('form.paymentPurpose')}
        minRows={2}
        autosize
        value={form.notes}
        onChange={(event) => {
          const value = event.currentTarget.value;
          setForm((prev) => ({ ...prev, notes: value }));
        }}
      />
    </FormModal>
  );
};
