import React from 'react';
import { Box, Button, Text } from '@mantine/core';
import { Plus } from '@phosphor-icons/react';
import { useEmployeePayrolls } from '@/shared/api/hooks/useEmployees';
import {
  useCreatePayroll,
  useArchivePayroll,
  useUpdatePayroll,
} from '@/shared/api/hooks/usePayrolls';
import type { Payroll, PayrollCreatePayload, PayrollType, PayrollUpdatePayload } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/format';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
import { PayrollFormModal } from './payments/PayrollFormModal';
import { PayrollTable } from './payments/PayrollTable';
import styles from '../employee-profile.module.css';

interface PaymentsTabProps {
  employeeId: number;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ employeeId }) => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [payrollType, setPayrollType] = React.useState<PayrollType>('salary');
  const [amount, setAmount] = React.useState(0);
  const [notes, setNotes] = React.useState('');
  const [deleteTargetId, setDeleteTargetId] = React.useState<number | null>(null);

  const { data: payrolls, isLoading } = useEmployeePayrolls(employeeId);
  const createPayroll = useCreatePayroll();
  const updatePayroll = useUpdatePayroll();
  const archivePayroll = useArchivePayroll();

  const editing = useResolvedById(payrolls, editingId);
  const deleteTarget = useResolvedById(payrolls, deleteTargetId);

  const total = React.useMemo(
    () => (payrolls ?? []).reduce((sum, p) => sum + p.amount, 0),
    [payrolls],
  );

  const openCreate = React.useCallback(() => {
    setEditingId(null);
    setPayrollType('salary');
    setAmount(0);
    setNotes('');
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((payroll: Payroll) => {
    setEditingId(payroll.id);
    setPayrollType(payroll.type);
    setAmount(payroll.amount);
    setNotes(payroll.notes ?? '');
    setFormOpen(true);
  }, []);

  const submit = React.useCallback(() => {
    if (editing) {
      const payload: PayrollUpdatePayload = {
        id: editing.id,
        employee_id: employeeId,
        type: payrollType,
        amount,
        notes: notes || null,
      };
      updatePayroll.mutate(payload, { onSuccess: () => setFormOpen(false) });
    } else {
      const payload: PayrollCreatePayload = {
        employee_id: employeeId,
        type: payrollType,
        amount,
        notes: notes || null,
      };
      createPayroll.mutate(payload, { onSuccess: () => setFormOpen(false) });
    }
  }, [payrollType, amount, notes, employeeId, editing, createPayroll, updatePayroll]);

  return (
    <Box>
      <Box className={styles.toolbar}>
        <Text fw={600}>
          Выплаты {payrolls && payrolls.length > 0 ? `· итого ${formatPrice(total)}` : ''}
        </Text>
        <Button size="sm" leftSection={<Plus size={15} />} onClick={openCreate}>
          Добавить выплату
        </Button>
      </Box>

      <PayrollTable
        payrolls={payrolls}
        isLoading={isLoading}
        onEdit={openEdit}
        onArchive={setDeleteTargetId}
      />

      <PayrollFormModal
        opened={formOpen}
        editing={editing}
        payrollType={payrollType}
        amount={amount}
        notes={notes}
        loading={createPayroll.isPending || updatePayroll.isPending}
        onClose={() => setFormOpen(false)}
        onSubmit={submit}
        onPayrollTypeChange={setPayrollType}
        onAmountChange={setAmount}
        onNotesChange={setNotes}
      />

      <ConfirmModal
        opened={Boolean(deleteTarget)}
        title="Архивировать выплату"
        message="Архивировать эту выплату? Запись будет скрыта."
        loading={archivePayroll.isPending}
        onConfirm={() =>
          deleteTarget &&
          archivePayroll.mutate(deleteTarget.id, { onSuccess: () => setDeleteTargetId(null) })
        }
        onClose={() => setDeleteTargetId(null)}
      />
    </Box>
  );
};
