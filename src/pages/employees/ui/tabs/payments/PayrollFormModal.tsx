import React from 'react';
import { NumberInput, Select, TextInput } from '@mantine/core';
import { MoneyIcon } from '@phosphor-icons/react';
import type { Payroll, PayrollType } from '@/shared/api/types';
import { formatPrice, PAYROLL_TYPE_OPTIONS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
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
}) => {
  const { t } = useI18n();
  return (
    <FormModal
      opened={opened}
      onClose={onClose}
      title={editing ? t('form.editPayroll') : t('form.addPayroll')}
      icon={<MoneyIcon />}
      size={567}
      footer={
        <FormModalFooter
          metaLabel={t('form.payoutAmount')}
          metaValue={formatPrice(amount)}
          onCancel={onClose}
          submitLabel={t('common.save')}
          onSubmit={onSubmit}
          submitDisabled={amount <= 0}
          loading={loading}
        />
      }
    >
      <FormSection title={t('form.payout')}>
        <FormFieldGrid>
          <Select
            label={t('form.payoutType')}
            required
            data={PAYROLL_TYPE_OPTIONS()}
            value={payrollType}
            onChange={(v) => onPayrollTypeChange((v as PayrollType) ?? 'salary')}
          />
          <NumberInput
            label={t('form.amount')}
            required
            min={1}
            value={amount}
            onChange={(v) => onAmountChange(Number(v) || 0)}
          />
        </FormFieldGrid>
      </FormSection>

      <FormSection title={t('common.comment')} muted>
        <TextInput
          placeholder={t('form.payrollComment')}
          value={notes}
          onChange={(e) => onNotesChange(e.currentTarget.value)}
        />
      </FormSection>

      {editing && (
        <FormSection title={t('form.changeHistory')} muted>
          <AuditLogsPanel tableName="payrolls" recordId={editing.id} />
        </FormSection>
      )}
    </FormModal>
  );
};
