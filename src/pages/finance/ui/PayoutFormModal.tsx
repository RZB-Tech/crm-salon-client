import React from 'react';
import { Badge, NumberInput, Select, Stack, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { HandCoinsIcon } from '@phosphor-icons/react';
import { useCreatePayout } from '@/shared/api/hooks/usePayouts';
import { useEmployees } from '@/shared/api/hooks/useEmployees';
import type { PayoutMethod, PayoutType } from '@/shared/api/types';
import { formatPrice, getEmployeeFullName } from '@/shared/lib/format';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormFieldGrid, FormModal, FormModalFooter, FormSection } from '@/shared/ui';
import {
  buildPayoutPayload,
  DEFAULT_PAYOUT_FORM,
  PAYOUT_METHOD_OPTIONS,
  PAYOUT_TYPE_LABELS,
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

  const isAdvance = form.payoutType === 'advance salary';

  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title="Новая выплата"
      subtitle="Зарплата, аванс или прочие выплаты сотруднику"
      icon={<HandCoinsIcon size={22} />}
      headerAside={
        <Badge variant="light" color="sage" radius="sm">
          {PAYOUT_TYPE_LABELS[form.payoutType]}
        </Badge>
      }
      size="lg"
      footer={
        <FormModalFooter
          metaLabel={isAdvance ? 'Сумма аванса' : undefined}
          metaValue={isAdvance ? formatPrice(form.amount) : undefined}
          onCancel={onClose}
          submitLabel="Провести выплату"
          onSubmit={handleSubmit}
          submitDisabled={!form.employeeId}
          loading={createPayout.isPending}
        />
      }
    >
      <FormSection title="Выплата">
        <Stack gap="sm">
          <Select
            label="Сотрудник"
            required
            searchable
            data={employeeOptions}
            value={form.employeeId}
            onChange={(value) => setField('employeeId', value)}
          />
          <FormFieldGrid cols={2}>
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
          </FormFieldGrid>
          {isAdvance && (
            <NumberInput
              label="Сумма аванса"
              min={1}
              value={form.amount}
              onChange={(v) => setField('amount', Number(v) || 0)}
              thousandSeparator=" "
              suffix=" сум"
            />
          )}
        </Stack>
      </FormSection>

      {form.payoutType === 'other' && (
        <FormSection title="Период" hint="Сумма рассчитывается по начислениям за выбранный период">
          <FormFieldGrid cols={2}>
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
          </FormFieldGrid>
        </FormSection>
      )}

      <FormSection title="Комментарий" muted>
        <Textarea
          placeholder="Основание выплаты, детали расчёта…"
          autosize
          minRows={2}
          value={form.notes}
          onChange={(e) => setField('notes', e.currentTarget.value)}
        />
      </FormSection>
    </FormModal>
  );
};
