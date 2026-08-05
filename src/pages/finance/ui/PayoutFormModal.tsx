import React from 'react';
import { Button, Group, Modal, NumberInput, Select, Stack, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useCreatePayout } from '@/shared/api/hooks/usePayouts';
import { useEmployees } from '@/shared/api/hooks/useEmployees';
import type { PayoutMethod, PayoutType } from '@/shared/api/types';
import { getEmployeeFullName } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import {
  buildPayoutPayload,
  DEFAULT_PAYOUT_FORM,
  PAYOUT_METHOD_OPTIONS,
  PAYOUT_TYPE_OPTIONS,
  type PayoutFormState,
} from '../lib/payoutHelpers';

interface PayoutFormModalProps {
  opened: boolean;
  onClose: () => void;
}

export const PayoutFormModal: React.FC<PayoutFormModalProps> = ({ opened, onClose }) => {
  const [form, setForm] = React.useState<PayoutFormState>(DEFAULT_PAYOUT_FORM);

  const { data: employees } = useEmployees();
  const createPayout = useCreatePayout();

  const employeeOptions = React.useMemo(
    () => (employees ?? []).map((e) => ({ value: String(e.id), label: getEmployeeFullName(e) })),
    [employees],
  );

  useResetOnOpen(opened, () => setForm(DEFAULT_PAYOUT_FORM));

  const handleSubmit = React.useCallback(() => {
    const payload = buildPayoutPayload(form);
    if (!payload) return;
    createPayout.mutate(payload, { onSuccess: onClose });
  }, [form, createPayout, onClose]);

  const setField = <K extends keyof PayoutFormState>(key: K, value: PayoutFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Новая выплата" radius="md" size="md">
      <Stack gap="md">
        <Select
          label="Сотрудник"
          required
          searchable
          data={employeeOptions}
          value={form.employeeId}
          onChange={(value) => setField('employeeId', value)}
        />
        <Select
          label="Тип выплаты"
          data={PAYOUT_TYPE_OPTIONS}
          value={form.payoutType}
          onChange={(v) => setField('payoutType', (v as PayoutType) ?? 'other')}
        />
        <Select
          label="Способ"
          data={PAYOUT_METHOD_OPTIONS}
          value={form.method}
          onChange={(v) => setField('method', (v as PayoutMethod) ?? 'cash')}
        />

        {form.payoutType === 'advance salary' && (
          <NumberInput
            label="Сумма аванса"
            min={1}
            value={form.amount}
            onChange={(v) => setField('amount', Number(v) || 0)}
            thousandSeparator=" "
            suffix=" сум"
          />
        )}

        {form.payoutType === 'other' && (
          <Group grow>
            <DateInput
              label="Начало периода"
              clearable
              value={form.startDate || null}
              onChange={(value) => setField('startDate', value ?? '')}
            />
            <DateInput
              label="Конец периода"
              clearable
              value={form.endDate || null}
              onChange={(value) => setField('endDate', value ?? '')}
            />
          </Group>
        )}

        <Textarea
          label="Примечание"
          value={form.notes}
          onChange={(e) => setField('notes', e.currentTarget.value)}
        />

        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            loading={createPayout.isPending}
            disabled={!form.employeeId}
          >
            Провести выплату
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
