import React from 'react';
import { NumberInput, Select, TextInput } from '@mantine/core';
import { FormFieldGrid } from '@/shared/ui';

interface ServiceFormFieldsProps {
  name: string;
  categoryId: string | null;
  categoryOptions: { value: string; label: string }[];
  price: number;
  estimatedTime: number;
  onNameChange: (value: string) => void;
  onCategoryChange: (value: string | null) => void;
  onPriceChange: (value: number) => void;
  onTimeChange: (value: number) => void;
}

export const ServiceFormFields: React.FC<ServiceFormFieldsProps> = ({
  name,
  categoryId,
  categoryOptions,
  price,
  estimatedTime,
  onNameChange,
  onCategoryChange,
  onPriceChange,
  onTimeChange,
}) => (
  <>
    <TextInput
      label="Название"
      required
      placeholder="Введите название"
      value={name}
      onChange={(e) => onNameChange(e.currentTarget.value)}
    />
    <Select
      label="Категория"
      required
      placeholder="Выберите категорию"
      data={categoryOptions}
      clearable
      value={categoryId}
      onChange={onCategoryChange}
    />
    <FormFieldGrid>
      <NumberInput
        label="Цена"
        min={0}
        placeholder="0 сум"
        value={price || ''}
        onChange={(v) => onPriceChange(Number(v) || 0)}
        thousandSeparator=" "
        suffix={price ? ' сум' : undefined}
      />
      <NumberInput
        label="Длительность"
        min={0}
        step={5}
        placeholder="0 минут"
        value={estimatedTime || ''}
        onChange={(v) => onTimeChange(Number(v) || 0)}
        suffix={estimatedTime ? ' минут' : undefined}
      />
    </FormFieldGrid>
  </>
);
