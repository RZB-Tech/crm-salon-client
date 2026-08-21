import React from 'react';
import { NumberInput, SegmentedControl, Select, Switch, Textarea, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import type { PromotionType } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
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
}) => {
  const { t } = useI18n();
  return (
    <>
      <FormSection title={t('form.promoDetails')}>
        <SegmentedControl
          fullWidth
          value={form.targetKind}
          onChange={(value) => {
            onChange('targetKind', value as PromotionTargetKind);
            onChange('targetId', null);
          }}
          data={[
            { value: 'service', label: t('form.service') },
            { value: 'material', label: t('form.product') },
          ]}
        />
        <TextInput
          label={t('common.name')}
          required
          placeholder={t('form.enterPromoName')}
          value={form.name}
          onChange={(event) => onChange('name', event.currentTarget.value)}
        />
        <Select
          label={form.targetKind === 'service' ? t('form.service') : t('form.product')}
          required
          searchable
          placeholder={
            form.targetKind === 'service' ? t('form.selectService') : t('form.selectProduct')
          }
          data={form.targetKind === 'service' ? serviceOptions : materialOptions}
          value={form.targetId}
          onChange={(value) => onChange('targetId', value)}
          nothingFoundMessage={t('form.nothingFound')}
        />
      </FormSection>

      <FormSection title={t('form.discount')}>
        <FormFieldGrid>
          <Select
            label={t('form.type')}
            required
            placeholder={t('form.selectDiscountType')}
            data={[
              { value: 'percentage', label: t('form.percentage') },
              { value: 'fixed_amount', label: t('form.fixedAmount') },
            ]}
            value={form.promoType}
            onChange={(value) => onChange('promoType', (value as PromotionType) ?? 'percentage')}
          />
          <NumberInput
            label={t('form.value')}
            required
            min={1}
            max={form.promoType === 'percentage' ? 100 : undefined}
            placeholder={t('form.enterDiscount')}
            value={form.discountValue || ''}
            onChange={(value) => onChange('discountValue', Number(value) || 0)}
            suffix={form.promoType === 'percentage' ? ' %' : ` ${t('common.currency')}`}
            thousandSeparator=" "
          />
        </FormFieldGrid>
      </FormSection>

      <FormSection
        title={t('form.period')}
        aside={
          <Switch
            label={t('form.enabled')}
            checked={form.isActive}
            onChange={(event) => onChange('isActive', event.currentTarget.checked)}
          />
        }
      >
        <FormFieldGrid>
          <DateInput
            label={t('form.from')}
            required
            clearable
            placeholder={t('form.selectDate')}
            value={form.startDate || null}
            onChange={(value) => onChange('startDate', value ?? '')}
          />
          <DateInput
            label={t('form.until')}
            required
            clearable
            placeholder={t('form.selectDate')}
            value={form.endDate || null}
            onChange={(value) => onChange('endDate', value ?? '')}
          />
        </FormFieldGrid>
      </FormSection>

      <FormSection title={t('form.description')} hint={t('common.optional')}>
        <Textarea
          placeholder={t('form.enterDescription')}
          autosize
          minRows={2}
          value={form.description}
          onChange={(event) => onChange('description', event.currentTarget.value)}
        />
      </FormSection>
    </>
  );
};
