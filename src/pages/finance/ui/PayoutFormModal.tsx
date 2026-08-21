import React from 'react';
import { Badge, NumberInput, Select, Stack, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { HandCoinsIcon } from '@phosphor-icons/react';
import { useCreatePayout } from '@/shared/api/hooks/usePayouts';
import { useEmployees } from '@/shared/api/hooks/useEmployees';
import type { PayoutMethod, PayoutType } from '@/shared/api/types';
import { getEmployeeFullName } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
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
  const { t } = useI18n();
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
      title={t('form.newPayout')}
      icon={<HandCoinsIcon />}
      badges={
        <Badge variant="light" color="sage" radius="sm">
          {PAYOUT_TYPE_LABELS[form.payoutType]}
        </Badge>
      }
      size={567}
      footer={
        <FormModalFooter
          onCancel={onClose}
          submitLabel={t('form.createPayout')}
          onSubmit={handleSubmit}
          submitDisabled={!form.employeeId}
          loading={createPayout.isPending}
        />
      }
    >
      <FormSection title={t('form.payout')}>
        <Stack gap="sm">
          <Select
            label={t('form.employee')}
            required
            searchable
            placeholder={t('form.selectEmployee')}
            data={employeeOptions}
            value={form.employeeId}
            onChange={(value) => setField('employeeId', value)}
          />
          <FormFieldGrid cols={2}>
            <Select
              label={t('form.payoutType')}
              required
              data={PAYOUT_TYPE_OPTIONS()}
              value={form.payoutType}
              onChange={(v) => setField('payoutType', (v as PayoutType) ?? 'other')}
            />
            <Select
              label={t('form.methodShort')}
              required
              data={PAYOUT_METHOD_OPTIONS()}
              value={form.method}
              onChange={(v) => setField('method', (v as PayoutMethod) ?? 'cash')}
            />
          </FormFieldGrid>
          {isAdvance && (
            <NumberInput
              label={t('form.advanceAmount')}
              min={1}
              value={form.amount}
              onChange={(v) => setField('amount', Number(v) || 0)}
              thousandSeparator=" "
              suffix={` ${t('common.currency')}`}
            />
          )}
        </Stack>
      </FormSection>

      {form.payoutType === 'other' && (
        <FormSection title={t('form.period')} hint={t('form.payoutPeriodHint')}>
          <FormFieldGrid cols={2}>
            <DateInput
              label={t('form.from')}
              required
              clearable
              placeholder={t('form.selectDate')}
              value={form.startDate || null}
              onChange={(value) => setField('startDate', value ?? '')}
            />
            <DateInput
              label={t('form.until')}
              required
              clearable
              placeholder={t('form.selectDate')}
              value={form.endDate || null}
              onChange={(value) => setField('endDate', value ?? '')}
            />
          </FormFieldGrid>
        </FormSection>
      )}

      <Textarea
        label={t('common.comment')}
        placeholder={t('form.payoutComment')}
        autosize
        minRows={2}
        value={form.notes}
        onChange={(e) => setField('notes', e.currentTarget.value)}
      />
    </FormModal>
  );
};
