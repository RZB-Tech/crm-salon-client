import React from 'react';
import {
  Badge,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea
} from '@mantine/core';
import { Plus } from '@phosphor-icons/react';
import { useCreatePayout, usePayouts } from '@/shared/api/hooks/usePayouts';
import { useEmployees } from '@/shared/api/hooks/useEmployees';
import { usePayrolls } from '@/shared/api/hooks/usePayrolls';
import type { Payroll, PayoutCreatePayload, PayoutMethod, PayoutType } from '@/shared/api/types';
import { DataTable, DataTableRow } from '@/shared/ui';
import {
  formatDate,
  formatDateTime,
  formatPrice,
  getEmployeeFullName,
  PAYROLL_TYPE_LABELS
} from '@/shared/lib/format';

const PAYOUT_TYPE_LABELS: Record<PayoutType, string> = {
  salary: 'Зарплата',
  'advance salary': 'Аванс',
  other: 'Прочее'
};

const PAYOUT_TYPE_OPTIONS = Object.entries(PAYOUT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label
}));

const PAYOUT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Наличные' },
  { value: 'card', label: 'Карта' }
];

const getPayrollSignedAmount = (payroll: Payroll): number =>
  payroll.type === 'penalty' ? -payroll.amount : payroll.amount;

interface PayoutsTabProps {
  enabled: boolean;
}

export const PayoutsTab: React.FC<PayoutsTabProps> = ({ enabled }) => {
  const [formOpen, setFormOpen] = React.useState(false);
  const [payoutType, setPayoutType] = React.useState<PayoutType>('other');
  const [employeeId, setEmployeeId] = React.useState<string | null>(null);
  const [method, setMethod] = React.useState<PayoutMethod>('cash');
  const [amount, setAmount] = React.useState<number>(0);
  const [notes, setNotes] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');

  const { data: payouts } = usePayouts();
  const { data: employees } = useEmployees();
  const { data: payrolls } = usePayrolls();
  const createPayout = useCreatePayout();

  const employeeOptions = React.useMemo(
    () => (employees ?? []).map((e) => ({ value: String(e.id), label: getEmployeeFullName(e) })),
    [employees]
  );

  const employeeMap = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const e of employees ?? []) map.set(e.id, getEmployeeFullName(e));
    return map;
  }, [employees]);

  const openForm = React.useCallback(() => {
    setPayoutType('other');
    setEmployeeId(null);
    setMethod('cash');
    setAmount(0);
    setNotes('');
    setStartDate('');
    setEndDate('');
    setFormOpen(true);
  }, []);

  const selectedPendingPayrolls = React.useMemo(() => {
    const selectedEmployeeId = employeeId ? Number(employeeId) : null;
    if (!selectedEmployeeId || payoutType === 'advance salary') return [];

    return (payrolls ?? []).filter((payroll) => {
      if (payroll.employee_id !== selectedEmployeeId) return false;
      if (payroll.status !== 'pending') return false;

      if (payoutType === 'other' && startDate && endDate) {
        const createdDate = payroll.created_at.slice(0, 10);
        return createdDate >= startDate && createdDate <= endDate;
      }

      return true;
    });
  }, [employeeId, payoutType, payrolls, startDate, endDate]);

  const selectedPayrollTotal = React.useMemo(
    () =>
      selectedPendingPayrolls.reduce((sum, payroll) => sum + getPayrollSignedAmount(payroll), 0),
    [selectedPendingPayrolls]
  );

  const canSubmit = React.useMemo(() => {
    if (!employeeId) return false;
    if (payoutType === 'advance salary') return amount > 0;
    return selectedPendingPayrolls.length > 0;
  }, [amount, employeeId, payoutType, selectedPendingPayrolls.length]);

  const handleSubmit = React.useCallback(() => {
    if (!employeeId) return;

    const payload: PayoutCreatePayload = {
      employee_id: Number(employeeId),
      type: payoutType,
      method,
      notes: notes || null
    };

    if (payoutType === 'advance salary' && amount > 0) {
      payload.amount = amount;
    }

    if (payoutType === 'other' && startDate && endDate) {
      payload.start_date = startDate;
      payload.end_date = endDate;
    }

    createPayout.mutate(payload, { onSuccess: () => setFormOpen(false) });
  }, [employeeId, payoutType, method, amount, notes, startDate, endDate, createPayout]);

  if (!enabled) return null;

  const list = payouts ?? [];

  return (
    <>
      <Group justify='flex-end' mb='md'>
        <Button leftSection={<Plus size={16} />} onClick={openForm}>
          Новая выплата
        </Button>
      </Group>

      <DataTable
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'employee', label: 'Сотрудник' },
          { key: 'type', label: 'Тип' },
          { key: 'payrolls', label: 'Начислений' },
          { key: 'total', label: 'Сумма' },
          { key: 'method', label: 'Способ' },
          { key: 'status', label: 'Статус' },
          { key: 'date', label: 'Дата' }
        ]}
        isEmpty={list.length === 0}
        emptyMessage='Выплат нет'
      >
        {list.map((payout) => (
          <DataTableRow key={payout.id} muted={payout.cancelled}>
            <Table.Td>
              <Text size='sm' ff='monospace' c='dimmed'>
                #{payout.id}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size='sm' fw={500}>
                {employeeMap.get(payout.employee_id) ?? `#${payout.employee_id}`}
              </Text>
            </Table.Td>
            <Table.Td>
              <Badge size='sm' variant='light' color='gray'>
                {PAYOUT_TYPE_LABELS[payout.type] ?? payout.type}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size='sm'>{payout.payrolls?.length ?? 0}</Text>
            </Table.Td>
            <Table.Td>
              <Text size='sm' fw={600}>
                {formatPrice(payout.total_amount)}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size='sm'>{payout.method === 'cash' ? 'Наличные' : 'Карта'}</Text>
            </Table.Td>
            <Table.Td>
              <Badge size='sm' variant='light' color={payout.cancelled ? 'red' : 'green'}>
                {payout.cancelled ? 'Отменена' : 'Проведена'}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size='xs'>{formatDateTime(payout.created_at)}</Text>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>

      <Modal
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        title='Новая выплата'
        radius='md'
        size='md'
      >
        <Stack gap='md'>
          <Select
            label='Сотрудник'
            required
            searchable
            data={employeeOptions}
            value={employeeId}
            onChange={setEmployeeId}
          />
          <Select
            label='Тип выплаты'
            data={PAYOUT_TYPE_OPTIONS}
            value={payoutType}
            onChange={(v) => setPayoutType((v as PayoutType) ?? 'other')}
          />
          <Select
            label='Способ'
            data={PAYOUT_METHOD_OPTIONS}
            value={method}
            onChange={(v) => setMethod((v as PayoutMethod) ?? 'cash')}
          />

          {payoutType === 'advance salary' && (
            <NumberInput
              label='Сумма аванса'
              min={1}
              value={amount}
              onChange={(v) => setAmount(Number(v) || 0)}
              thousandSeparator=' '
              suffix=' сум'
            />
          )}

          {payoutType === 'other' && (
            <Group grow>
              <TextInput
                label='Начало периода'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.currentTarget.value)}
              />
              <TextInput
                label='Конец периода'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.currentTarget.value)}
              />
            </Group>
          )}

          {employeeId && payoutType !== 'advance salary' && (
            <Stack gap={6}>
              <Group justify='space-between'>
                <Text size='sm' fw={600}>
                  К выплате по начислениям
                </Text>
                <Badge color={selectedPayrollTotal < 0 ? 'red' : 'green'} variant='light'>
                  {formatPrice(selectedPayrollTotal)}
                </Badge>
              </Group>
              {selectedPendingPayrolls.length === 0 ? (
                <Text size='xs' c='dimmed'>
                  Pending-начислений для выбранных условий нет
                </Text>
              ) : (
                <Stack gap={4}>
                  {selectedPendingPayrolls.slice(0, 4).map((payroll) => (
                    <Group key={payroll.id} justify='space-between' gap='sm'>
                      <Text size='xs' c='dimmed'>
                        {PAYROLL_TYPE_LABELS[payroll.type]} · {formatDate(payroll.created_at)}
                      </Text>
                      <Text size='xs' fw={600}>
                        {formatPrice(getPayrollSignedAmount(payroll))}
                      </Text>
                    </Group>
                  ))}
                  {selectedPendingPayrolls.length > 4 && (
                    <Text size='xs' c='dimmed'>
                      И ещё {selectedPendingPayrolls.length - 4}
                    </Text>
                  )}
                </Stack>
              )}
            </Stack>
          )}

          <Textarea
            label='Примечание'
            value={notes}
            onChange={(e) => setNotes(e.currentTarget.value)}
          />

          <Group justify='flex-end'>
            <Button variant='subtle' color='gray' onClick={() => setFormOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSubmit} loading={createPayout.isPending} disabled={!canSubmit}>
              Провести выплату
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
