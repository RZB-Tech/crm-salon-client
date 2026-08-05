import React from 'react';
import { Group, NumberInput, Text } from '@mantine/core';
import type { EmployeeFormState } from './employeeFormState';

interface EmployeeSalaryFieldsProps {
  form: EmployeeFormState;
  onChange: (form: EmployeeFormState) => void;
}

export const EmployeeSalaryFields: React.FC<EmployeeSalaryFieldsProps> = ({ form, onChange }) => (
  <>
    <Text size="sm" fw={600}>
      Зарплата
    </Text>
    <Group grow>
      <NumberInput
        label="Фиксированная"
        min={0}
        value={form.salary_fixed}
        onChange={(v) => onChange({ ...form, salary_fixed: Number(v) || 0 })}
      />
      <NumberInput
        label="% от услуг"
        min={0}
        max={100}
        value={form.percent_from_services}
        onChange={(v) => onChange({ ...form, percent_from_services: Number(v) || 0 })}
      />
    </Group>
    <NumberInput
      label="% от продаж"
      min={0}
      max={100}
      value={form.percent_from_sales}
      onChange={(v) => onChange({ ...form, percent_from_sales: Number(v) || 0 })}
    />
  </>
);
