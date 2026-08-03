import React from 'react';
import {
  Box,
  Group,
  Button,
  Table,
  Text,
  Badge,
  ActionIcon,
  Modal,
  Select,
  TextInput,
  Skeleton,
  NumberInput,
} from '@mantine/core';
import { ArchiveIcon, Plus } from '@phosphor-icons/react';
import { useEmployeePayrolls } from '@/shared/api/hooks/useEmployees';
import {
  useCreatePayroll,
  useArchivePayroll,
  useUpdatePayroll,
} from '@/shared/api/hooks/usePayrolls';
import type { Payroll, PayrollCreatePayload, PayrollType, PayrollUpdatePayload } from '@/shared/api/types';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import { ConfirmModal, DataTable, DataTableRow } from '@/shared/ui';
import { formatDate, formatPrice, PAYROLL_TYPE_LABELS, PAYROLL_TYPE_OPTIONS } from '@/shared/lib/format';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';
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

      {isLoading ? (
        <Skeleton height={160} radius="md" />
      ) : (
        <DataTable
          compact
          stickyHeader={false}
          maxHeight={420}
          columns={[
            { key: 'type', label: 'Тип' },
            { key: 'amount', label: 'Сумма' },
            { key: 'notes', label: 'Заметка' },
            { key: 'date', label: 'Дата' },
            { key: 'actions', label: '', width: 48 },
          ]}
          isEmpty={(payrolls ?? []).length === 0}
          emptyMessage="Выплат пока нет"
        >
          {(payrolls ?? []).map((payroll) => (
            <DataTableRow
              key={payroll.id}
              onClick={() => openEdit(payroll)}
              style={{ cursor: 'pointer' }}
            >
              <Table.Td>
                <Badge size="sm" variant="light">
                  {PAYROLL_TYPE_LABELS[payroll.type]}
                </Badge>
              </Table.Td>
              <Table.Td>
                <Text size="sm" fw={600}>
                  {formatPrice(payroll.amount)}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{payroll.notes || '—'}</Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm">{formatDate(payroll.created_at)}</Text>
              </Table.Td>
              <Table.Td>
                <ActionIcon
                  variant="subtle"
                  color="orange"
                  size="sm"
                  aria-label="Архивировать"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTargetId(payroll.id);
                  }}
                >
                  <ArchiveIcon size={16} />
                </ActionIcon>
              </Table.Td>
            </DataTableRow>
          ))}
        </DataTable>
      )}

      <Modal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Редактировать выплату' : 'Новая выплата'}
        radius="md"
      >
        <Select label="Тип выплаты" required data={PAYROLL_TYPE_OPTIONS} mb="md" value={payrollType} onChange={(v) => setPayrollType((v as PayrollType) ?? 'salary')} />
        <NumberInput label="Сумма" required min={1} mb="md" value={amount} onChange={(v) => setAmount(Number(v) || 0)} />
        <TextInput label="Заметка" mb="lg" value={notes} onChange={(e) => setNotes(e.currentTarget.value)} />
        {editing && (
          <>
            <Text size="sm" fw={600} mb="xs">
              История изменений
            </Text>
            <AuditLogsPanel tableName="payrolls" recordId={editing.id} />
          </>
        )}
        <Group justify="flex-end" mt={editing ? 'md' : undefined}>
          <Button variant="subtle" color="gray" onClick={() => setFormOpen(false)}>Отмена</Button>
          <Button onClick={submit} loading={createPayroll.isPending || updatePayroll.isPending} disabled={amount <= 0}>
            Сохранить
          </Button>
        </Group>
      </Modal>

      <ConfirmModal
        opened={Boolean(deleteTarget)}
        title="Архивировать выплату"
        message="Архивировать эту выплату? Запись будет скрыта."
        loading={archivePayroll.isPending}
        onConfirm={() => deleteTarget && archivePayroll.mutate(deleteTarget.id, { onSuccess: () => setDeleteTargetId(null) })}
        onClose={() => setDeleteTargetId(null)}
      />
    </Box>
  );
};
