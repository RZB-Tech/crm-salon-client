import React from 'react';
import { NumberInput, Select, TextInput } from '@mantine/core';
import type { MeasurementUnit } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
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
  onChange,
}) => {
  const { t } = useI18n();
  return (
    <>
      <FormSection title={t('form.material')}>
        <FormFieldGrid>
          <TextInput
            label={t('form.sku')}
            required
            placeholder={t('form.enterSku')}
            value={form.article}
            onChange={(e) => onChange({ ...form, article: e.currentTarget.value })}
          />
          <TextInput
            label={t('common.name')}
            required
            placeholder={t('form.enterName')}
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.currentTarget.value })}
          />
        </FormFieldGrid>
        <TextInput
          label={t('form.description')}
          placeholder={t('form.enterDescription')}
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.currentTarget.value })}
        />
      </FormSection>

      <FormSection
        title={t('nav.materials')}
        hint={isEdit ? t('materials.quantityHint') : undefined}
      >
        <FormFieldGrid>
          {!isEdit && (
            <NumberInput
              label={t('materials.initialQuantity')}
              min={0}
              placeholder={t('materials.enterQuantity')}
              value={form.quantity || ''}
              onChange={(v) => onChange({ ...form, quantity: Number(v) || 0 })}
            />
          )}
          <Select
            label={t('materials.measurementUnit')}
            placeholder={t('materials.selectUnit')}
            data={MEASUREMENT_OPTIONS()}
            value={form.measurement_unit}
            onChange={(v) =>
              onChange({ ...form, measurement_unit: (v as MeasurementUnit) ?? 'piece' })
            }
          />
        </FormFieldGrid>
        <NumberInput
          label={t('materials.volume')}
          min={0}
          placeholder={t('materials.enterVolume')}
          value={form.volume || ''}
          onChange={(v) => onChange({ ...form, volume: Number(v) || 0 })}
        />
      </FormSection>

      <NumberInput
        label={t('materials.sellPrice')}
        required
        min={0}
        placeholder={t('materials.enterPrice')}
        value={form.sell_price || ''}
        onChange={(v) => onChange({ ...form, sell_price: Number(v) || 0 })}
        thousandSeparator=" "
        suffix={form.sell_price ? ` ${t('common.currency')}` : undefined}
      />
    </>
  );
};
