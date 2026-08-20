import React from 'react';
import { NumberInput, SegmentedControl, Select, Switch, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import type { PromotionType } from '@/shared/api/types';
import { FormFieldGrid, FormSection } from '@/shared/ui';
import type { PromotionFormState, PromotionTargetKind } from '../lib/promotionForm';

interface PromotionFormFieldsProps {
  form: PromotionFormState;
  serviceOptions: { value: string; label: string }[];
  materialOptions: { value: string; label: string }[];
  onChange: <K extends keyof PromotionFormState>(key: K, value: PromotionFormState[K]) => void;
}

export const PromotionFormFields: React.FC<PromotionFormFieldsProps> = ({
  form,
  serviceOptions,
  materialOptions,
  onChange,
}) => (
  <>
    <FormSection title="Детали акции">
      <SegmentedControl
        fullWidth
        value={form.targetKind}
        onChange={(value) => {
          onChange('targetKind', value as PromotionTargetKind);
          onChange('targetId', null);
        }}
        data={[
          { value: 'service', label: 'Услуга' },
          { value: 'material', label: 'Товар' },
        ]}
      />
      <TextInput
        label="Название"
        required
        placeholder="Введите название акции"
        value={form.name}
        onChange={(event) => onChange('name', event.currentTarget.value)}
      />
      <Select
        label={form.targetKind === 'service' ? 'Услуга' : 'Товар'}
        required
        searchable
        placeholder={form.targetKind === 'service' ? 'Выберите услугу' : 'Выберите товар'}
        data={form.targetKind === 'service' ? serviceOptions : materialOptions}
        value={form.targetId}
        onChange={(value) => onChange('targetId', value)}
        nothingFoundMessage="Ничего не найдено"
      />
    </FormSection>

    <FormSection title="Скидка">
      <FormFieldGrid>
        <Select
          label="Тип"
          required
          placeholder="Выберите тип скидки"
          data={[
            { value: 'percentage', label: 'Процент' },
            { value: 'fixed_amount', label: 'Фиксированная сумма' },
          ]}
          value={form.promoType}
          onChange={(value) => onChange('promoType', (value as PromotionType) ?? 'percentage')}
        />
        <NumberInput
          label="Значение"
          required
          min={1}
          max={form.promoType === 'percentage' ? 100 : undefined}
          placeholder="Введите значение скидки"
          value={form.discountValue || ''}
          onChange={(value) => onChange('discountValue', Number(value) || 0)}
          suffix={form.promoType === 'percentage' ? ' %' : ' сум'}
          thousandSeparator=" "
        />
      </FormFieldGrid>
    </FormSection>

    <FormSection
      title="Период"
      aside={
        <Switch
          label="Вкл"
          checked={form.isActive}
          onChange={(event) => onChange('isActive', event.currentTarget.checked)}
        />
      }
    >
      <FormFieldGrid>
        <DateInput
          label="С"
          required
          clearable
          placeholder="Выберите дату"
          value={form.startDate || null}
          onChange={(value) => onChange('startDate', value ?? '')}
        />
        <DateInput
          label="По"
          required
          clearable
          placeholder="Выберите дату"
          value={form.endDate || null}
          onChange={(value) => onChange('endDate', value ?? '')}
        />
      </FormFieldGrid>
    </FormSection>

    <FormSection title="Описание" hint="Необязательно">
      <Textarea
        placeholder="Введите описание"
        autosize
        minRows={2}
        value={form.description}
        onChange={(event) => onChange('description', event.currentTarget.value)}
      />
    </FormSection>
  </>
);
