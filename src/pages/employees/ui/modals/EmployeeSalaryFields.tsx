import React from 'react';
import { NumberInput } from '@mantine/core';
import { FormFieldGrid, FormSection } from '@/shared/ui';
import type { EmployeeFormState } from './employeeFormState';

interface EmployeeSalaryFieldsProps {
  form: EmployeeFormState;
  onChange: (form: EmployeeFormState) => void;
}

export const EmployeeSalaryFields: React.FC<EmployeeSalaryFieldsProps> = ({ form, onChange }) => (
  <FormSection title="Зарплата">
    <NumberInput
      label="Фиксированная сумма"
      placeholder="Введите сумму"
      min={0}
      value={form.salary_fixed}
      onChange={(v) => onChange({ ...form, salary_fixed: Number(v) || 0 })}
    />
    <FormFieldGrid>
      <NumberInput
        label="% от услуг"
        placeholder="Введите %"
        min={0}
        max={100}
        value={form.percent_from_services}
        onChange={(v) => onChange({ ...form, percent_from_services: Number(v) || 0 })}
      />
      <NumberInput
        label="% от продаж"
        placeholder="Введите %"
        min={0}
        max={100}
        value={form.percent_from_sales}
        onChange={(v) => onChange({ ...form, percent_from_sales: Number(v) || 0 })}
      />
    </FormFieldGrid>
  </FormSection>
);
