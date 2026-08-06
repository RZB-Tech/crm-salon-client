import React from 'react';
import { NumberInput, Select, TextInput } from '@mantine/core';
import { MoneyIcon } from '@phosphor-icons/react';
import type { Payroll, PayrollType } from '@/shared/api/types';
import { formatPrice, PAYROLL_TYPE_OPTIONS } from '@/shared/lib/format';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';

interface PayrollFormModalProps {
  opened: boolean;
  editing: Payroll | null;
  payrollType: PayrollType;
  amount: number;
  notes: string;
  loading: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onPayrollTypeChange: (type: PayrollType) => void;
  onAmountChange: (amount: number) => void;
  onNotesChange: (notes: string) => void;
}

export const PayrollFormModal: React.FC<PayrollFormModalProps> = ({
  opened,
  editing,
  payrollType,
  amount,
  notes,
  loading,
  onClose,
  onSubmit,
  onPayrollTypeChange,
  onAmountChange,
  onNotesChange,
}) => (
  <FormModal
    opened={opened}
    onClose={onClose}
    title={editing ? 'Редактировать выплату' : 'Новая выплата'}
    subtitle="Тип, сумма и заметка"
    icon={<MoneyIcon size={22} />}
    size="lg"
    footer={
      <FormModalFooter
        metaLabel="Сумма выплаты"
        metaValue={formatPrice(amount)}
        onCancel={onClose}
        submitLabel="Сохранить"
        onSubmit={onSubmit}
        submitDisabled={amount <= 0}
        loading={loading}
      />
    }
  >
    <FormSection title="Выплата">
      <FormFieldGrid>
        <Select
          label="Тип выплаты"
          required
          data={PAYROLL_TYPE_OPTIONS}
          value={payrollType}
          onChange={(v) => onPayrollTypeChange((v as PayrollType) ?? 'salary')}
        />
        <NumberInput
          label="Сумма"
          required
          min={1}
          value={amount}
          onChange={(v) => onAmountChange(Number(v) || 0)}
        />
      </FormFieldGrid>
    </FormSection>

    <FormSection title="Комментарий" muted>
      <TextInput
        placeholder="Например: аванс за первую половину месяца"
        value={notes}
        onChange={(e) => onNotesChange(e.currentTarget.value)}
      />
    </FormSection>

    {editing && (
      <FormSection title="История изменений" muted>
        <AuditLogsPanel tableName="payrolls" recordId={editing.id} />
      </FormSection>
    )}
  </FormModal>
);
