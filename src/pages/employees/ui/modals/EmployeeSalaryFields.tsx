import React from 'react';
import { NumberInput } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';
import { FormFieldGrid, FormSection } from '@/shared/ui';
import type { EmployeeFormState } from './employeeFormState';

interface EmployeeSalaryFieldsProps {
  form: EmployeeFormState;
  onChange: (form: EmployeeFormState) => void;
}

export const EmployeeSalaryFields: React.FC<EmployeeSalaryFieldsProps> = ({ form, onChange }) => {
  const { t } = useI18n();
  return (
    <FormSection title={t('employees.salary')}>
      <NumberInput
        label={t('employees.salaryFixed')}
        placeholder={t('employees.enterAmount')}
        min={0}
        value={form.salary_fixed}
        onChange={(v) => onChange({ ...form, salary_fixed: Number(v) || 0 })}
      />
      <FormFieldGrid>
        <NumberInput
          label={t('employees.percentFromServices')}
          placeholder={t('employees.enterPercent')}
          min={0}
          max={100}
          value={form.percent_from_services}
          onChange={(v) => onChange({ ...form, percent_from_services: Number(v) || 0 })}
        />
        <NumberInput
          label={t('employees.percentFromSales')}
          placeholder={t('employees.enterPercent')}
          min={0}
          max={100}
          value={form.percent_from_sales}
          onChange={(v) => onChange({ ...form, percent_from_sales: Number(v) || 0 })}
        />
      </FormFieldGrid>
    </FormSection>
  );
};
