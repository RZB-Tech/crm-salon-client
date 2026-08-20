import React from 'react';
import { NumberInput, Select } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { GIFT_CARD_PURCHASE_METHOD_OPTIONS, toDateInput } from '@/shared/lib/format';
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
}) => (
  <>
    <FormSection title="Купон">
      <Select
        label="Клиент"
        searchable
        clearable
        disabled={isEdit}
        placeholder="Необязательно — купон для любого клиента"
        data={clientOptions}
        value={form.clientId}
        onChange={(value) => onChange('clientId', value)}
        nothingFoundMessage="Клиент не найден"
      />
      <FormFieldGrid>
        <NumberInput
          label="Номинал"
          required
          disabled={isEdit}
          min={1}
          placeholder="Сумма купона"
          value={form.initialAmount || ''}
          onChange={(value) => onChange('initialAmount', Number(value) || 0)}
          thousandSeparator=" "
          suffix=" сум"
        />
        <Select
          label="Оплата при продаже"
          required
          disabled={isEdit}
          data={GIFT_CARD_PURCHASE_METHOD_OPTIONS}
          value={form.paymentMethod}
          onChange={(value) => onChange('paymentMethod', (value as PaymentMethod) ?? 'cash')}
        />
      </FormFieldGrid>
    </FormSection>

    <FormSection title="Срок" hint="Если не указать — купон бессрочный">
      <DateInput
        label="Действует до"
        clearable
        placeholder="Выберите дату"
        value={form.expirationDate || null}
        minDate={toDateInput(new Date())}
        onChange={(value) => onChange('expirationDate', value ?? '')}
      />
    </FormSection>
  </>
);
