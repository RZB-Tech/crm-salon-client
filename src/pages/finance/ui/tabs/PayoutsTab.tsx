import React from 'react';
import {
  Badge,
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useCreatePayout, usePayouts } from '@/shared/api/hooks/usePayouts';
import { useEmployees } from '@/shared/api/hooks/useEmployees';
import type { PayoutCreatePayload, PayoutMethod, PayoutType } from '@/shared/api/types';
import { ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { formatDateTime, formatPrice, getEmployeeFullName } from '@/shared/lib/format';

const PAYOUT_TYPE_LABELS: Record<PayoutType, string> = {
  salary: 'Зарплата',
  'advance salary': 'Аванс',
  other: 'Прочее',
};

const PAYOUT_TYPE_OPTIONS = Object.entries(PAYOUT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const PAYOUT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Наличные' },
  { value: 'card', label: 'Карта' },
];

export type PayoutsTabHandle = {
  openCreate: () => void;
};

interface PayoutsTabProps {
  enabled: boolean;
}

export const PayoutsTab = React.forwardRef<PayoutsTabHandle, PayoutsTabProps>(function PayoutsTab(
  { enabled },
  ref,
) {
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
  const createPayout = useCreatePayout();

  const employeeOptions = React.useMemo(
    () => (employees ?? []).map((e) => ({ value: String(e.id), label: getEmployeeFullName(e) })),
    [employees],
  );

  const employeeMap = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const e of employees ?? []) map.set(e.id, getEmployeeFullName(e));
    return map;
  }, [employees]);

  const list = payouts ?? [];
  const { page, pageSize, paginatedItems, total, setPage, setPageSize } = usePagination(list, {
    defaultPageSize: 20,
  });

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

  React.useImperativeHandle(ref, () => ({ openCreate: openForm }), [openForm]);

  const handleSubmit = React.useCallback(() => {
    if (!employeeId) return;

    const payload: PayoutCreatePayload = {
      employee_id: Number(employeeId),
      type: payoutType,
      method,
      notes: notes || null,
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

  return (
    <Box className={listPageStyles.panel}>
      <Box className={listPageStyles.panelBody}>
        <Table verticalSpacing="sm" horizontalSpacing="md" className={listPageStyles.table}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={listPageStyles.headCell}>ID</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Сотрудник</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Тип</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Сумма</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Способ</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Статус</Table.Th>
              <Table.Th className={listPageStyles.headCell}>Дата</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedItems.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text size="sm" c="dimmed" ta="center" py="xl">
                    Выплат нет
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              paginatedItems.map((payout) => (
                <Table.Tr
                  key={payout.id}
                  className={`${listPageStyles.row}${payout.cancelled ? ` ${listPageStyles.mutedRow}` : ''}`}
                >
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" ff="monospace" c="rgba(72,72,72,0.4)">
                      #{payout.id}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" fw={500} c="#484848">
                      {employeeMap.get(payout.employee_id) ?? `#${payout.employee_id}`}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Badge size="sm" variant="light" color="gray">
                      {PAYOUT_TYPE_LABELS[payout.type] ?? payout.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" fw={600} c="#484848">
                      {formatPrice(payout.total_amount)}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="sm" c="rgba(72,72,72,0.4)">
                      {payout.method === 'cash' ? 'Наличные' : 'Карта'}
                    </Text>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Badge size="sm" variant="light" color={payout.cancelled ? 'red' : 'green'}>
                      {payout.cancelled ? 'Отменена' : 'Проведена'}
                    </Badge>
                  </Table.Td>
                  <Table.Td className={listPageStyles.bodyCell}>
                    <Text size="xs" c="rgba(72,72,72,0.4)">
                      {formatDateTime(payout.created_at)}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))
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
        title="Новая выплата"
        radius="md"
        size="md"
      >
        <Stack gap="md">
          <Select
            label="Сотрудник"
            required
            searchable
            data={employeeOptions}
            value={employeeId}
            onChange={setEmployeeId}
          />
          <Select
            label="Тип выплаты"
            data={PAYOUT_TYPE_OPTIONS}
            value={payoutType}
            onChange={(v) => setPayoutType((v as PayoutType) ?? 'other')}
          />
          <Select
            label="Способ"
            data={PAYOUT_METHOD_OPTIONS}
            value={method}
            onChange={(v) => setMethod((v as PayoutMethod) ?? 'cash')}
          />

          {payoutType === 'advance salary' && (
            <NumberInput
              label="Сумма аванса"
              min={1}
              value={amount}
              onChange={(v) => setAmount(Number(v) || 0)}
              thousandSeparator=" "
              suffix=" сум"
            />
          )}

          {payoutType === 'other' && (
            <Group grow>
              <TextInput
                label="Начало периода"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.currentTarget.value)}
              />
              <TextInput
                label="Конец периода"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.currentTarget.value)}
              />
            </Group>
          )}

          <Textarea
            label="Примечание"
            value={notes}
            onChange={(e) => setNotes(e.currentTarget.value)}
          />

          <Group justify="flex-end">
            <Button variant="subtle" color="gray" onClick={() => setFormOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              loading={createPayout.isPending}
              disabled={!employeeId}
            >
              Провести выплату
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
});
