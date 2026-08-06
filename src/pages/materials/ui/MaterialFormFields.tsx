import React from 'react';
import { NumberInput, Select, Stack, Textarea, TextInput } from '@mantine/core';
import type { MeasurementUnit } from '@/shared/api/types';
import { FormFieldGrid, FormSection } from '@/shared/ui';
import { MEASUREMENT_OPTIONS, type MaterialFormState } from '../lib/materialForm';

interface MaterialFormFieldsProps {
  form: MaterialFormState;
  isEdit: boolean;
  onChange: (form: MaterialFormState) => void;
}

export const MaterialFormFields: React.FC<MaterialFormFieldsProps> = ({
  form,
  isEdit,
  onChange
}) => (
  <>
    <FormSection title='Основное'>
      <Stack gap='sm'>
        <FormFieldGrid>
          <TextInput
            label='Артикул'
            required
            value={form.article}
            onChange={(e) => onChange({ ...form, article: e.currentTarget.value })}
          />
          <TextInput
            label='Название'
            required
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.currentTarget.value })}
          />
        </FormFieldGrid>
        <Textarea
          label='Описание'
          autosize
          minRows={2}
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.currentTarget.value })}
        />
      </Stack>
    </FormSection>

    <FormSection
      title='Склад'
      hint={isEdit ? 'Количество меняется отдельной операцией прихода или расхода' : undefined}
    >
      <FormFieldGrid cols={isEdit ? 2 : 3}>
        {!isEdit && (
          <NumberInput
            label='Начальное количество'
            min={0}
            value={form.quantity}
            onChange={(v) => onChange({ ...form, quantity: Number(v) || 0 })}
          />
        )}
        <Select
          label='Единица измерения'
          data={MEASUREMENT_OPTIONS}
          value={form.measurement_unit}
          onChange={(v) =>
            onChange({ ...form, measurement_unit: (v as MeasurementUnit) ?? 'piece' })
          }
        />
        <NumberInput
          label='Объём'
          min={0}
          value={form.volume}
          onChange={(v) => onChange({ ...form, volume: Number(v) || 0 })}
        />
      </FormFieldGrid>
    </FormSection>

    <FormSection title='Цена'>
      <NumberInput
        label='Цена продажи'
        min={0}
        value={form.sell_price}
        onChange={(v) => onChange({ ...form, sell_price: Number(v) || 0 })}
        thousandSeparator=' '
        suffix=' сум'
      />
    </FormSection>
  </>
);
