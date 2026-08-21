import React from 'react';
import { NumberInput, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { GIFT_CARD_PURCHASE_METHOD_OPTIONS, toDateInput } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import type { PaymentMethod } from '@/shared/api/types';
import { FormFieldGrid, FormSection } from '@/shared/ui';
import type { GiftCardFormState } from '../lib/giftCardForm';

interface GiftCardFormFieldsProps {
  form: GiftCardFormState;
  isEdit: boolean;
  clientOptions: { value: string; label: string }[];
  onChange: <K extends keyof GiftCardFormState>(key: K, value: GiftCardFormState[K]) => void;
}

export const GiftCardFormFields: React.FC<GiftCardFormFieldsProps> = ({
  form,
  isEdit,
  clientOptions,
  onChange,
}) => {
  const { t } = useI18n();
  return (
  <>
    <FormSection title={t('form.coupon')}>
      <Select
        label={t('form.client')}
        searchable
        clearable
        disabled={isEdit}
        placeholder={t('giftCards.anyClient')}
        data={clientOptions}
        value={form.clientId}
        onChange={(value) => onChange('clientId', value)}
        nothingFoundMessage={t('giftCards.clientNotFound')}
      />
      <FormFieldGrid>
        <NumberInput
          label={t('giftCards.faceValue')}
          required
          disabled={isEdit}
          min={1}
          placeholder={t('form.couponAmount')}
          value={form.initialAmount || ''}
          onChange={(value) => onChange('initialAmount', Number(value) || 0)}
          thousandSeparator=" "
          suffix={` ${t('common.currency')}`}
        />
        <Select
          label={t('form.payOnSale')}
          required
          disabled={isEdit}
          data={GIFT_CARD_PURCHASE_METHOD_OPTIONS()}
          value={form.paymentMethod}
          onChange={(value) => onChange('paymentMethod', (value as PaymentMethod) ?? 'cash')}
        />
      </FormFieldGrid>
    </FormSection>

    <FormSection title={t('form.period')} hint={t('form.unlimitedHint')}>
      <DateInput
        label={t('form.validUntil')}
        clearable
        placeholder={t('form.selectDate')}
        value={form.expirationDate || null}
        minDate={toDateInput(new Date())}
        onChange={(value) => onChange('expirationDate', value ?? '')}
      />
    </FormSection>
  </>
  );
};
