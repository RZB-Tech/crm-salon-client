import React from 'react';
import { NumberInput, Select, TextInput } from '@mantine/core';
import { useI18n } from '@/shared/lib/i18n';
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
}) => {
  const { t } = useI18n();
  return (
    <>
      <TextInput
        label={t('common.name')}
        required
        placeholder={t('form.enterName')}
        value={name}
        onChange={(e) => onNameChange(e.currentTarget.value)}
      />
      <Select
        label={t('services.category')}
        required
        placeholder={t('services.selectCategory')}
        data={categoryOptions}
        clearable
        value={categoryId}
        onChange={onCategoryChange}
      />
      <FormFieldGrid>
        <NumberInput
          label={t('services.price')}
          min={0}
          placeholder={t('services.pricePlaceholder')}
          value={price || ''}
          onChange={(v) => onPriceChange(Number(v) || 0)}
          thousandSeparator=" "
          suffix={price ? ` ${t('common.currency')}` : undefined}
        />
        <NumberInput
          label={t('services.duration')}
          min={0}
          step={5}
          placeholder={t('services.durationPlaceholder')}
          value={estimatedTime || ''}
          onChange={(v) => onTimeChange(Number(v) || 0)}
          suffix={estimatedTime ? ` ${t('services.minutes')}` : undefined}
        />
      </FormFieldGrid>
    </>
  );
};
