import React from 'react';
import { Button, Group, Modal, NumberInput, Select, Text, TextInput } from '@mantine/core';
import type { Payroll, PayrollType } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { PAYROLL_TYPE_OPTIONS } from '@/shared/lib/format';

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
  <Modal
    opened={opened}
    onClose={onClose}
    title={editing ? 'Редактировать выплату' : 'Новая выплата'}
    radius="md"
  >
    <Select
      label="Тип выплаты"
      required
      data={PAYROLL_TYPE_OPTIONS}
      mb="md"
      value={payrollType}
      onChange={(v) => onPayrollTypeChange((v as PayrollType) ?? 'salary')}
    />
    <NumberInput
      label="Сумма"
      required
      min={1}
      mb="md"
      value={amount}
      onChange={(v) => onAmountChange(Number(v) || 0)}
    />
    <TextInput
      label="Заметка"
      mb="lg"
      value={notes}
      onChange={(e) => onNotesChange(e.currentTarget.value)}
    />
    {editing && (
      <>
        <Text size="sm" fw={600} mb="xs">
          История изменений
        </Text>
        <AuditLogsPanel tableName="payrolls" recordId={editing.id} />
      </>
    )}
    <Group justify="flex-end" mt={editing ? 'md' : undefined}>
      <Button variant="subtle" color="gray" onClick={onClose}>
        Отмена
      </Button>
      <Button onClick={onSubmit} loading={loading} disabled={amount <= 0}>
        Сохранить
      </Button>
    </Group>
  </Modal>
);
