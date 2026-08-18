import React from 'react';
import { NumberInput, TextInput } from '@mantine/core';
import type { Promotion } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import {
  getLinePromoView,
  isPriceChanged,
  type AppointmentServiceLine,
} from '../../lib/appointmentForm';
import { ServiceLinePromo } from './ServiceLinePromo';
import styles from './appointment-form-modal.module.css';

interface ServiceLineMetricsProps {
  line: AppointmentServiceLine;
  promotions: Promotion[];
  readOnly: boolean;
  onQuantityChange: (quantity: number) => void;
  onPriceChange: (price: number) => void;
  onReasonChange: (reason: string) => void;
}

export const ServiceLineMetrics: React.FC<ServiceLineMetricsProps> = ({
  line,
  promotions,
  readOnly,
  onQuantityChange,
  onPriceChange,
  onReasonChange,
}) => {
  const changed = isPriceChanged(line);
  const promo = getLinePromoView(line, promotions);
  const unitFinal = promo.final;

  return (
    <>
      <div className={styles.lineMetrics}>
        <NumberInput
          label="Количество"
          min={1}
          placeholder="1"
          value={line.quantity}
          onChange={(value) => onQuantityChange(Number(value) || 1)}
          disabled={readOnly}
        />
        <NumberInput
          label="Цена"
          min={0}
          placeholder="200 000 сум"
          value={line.price || ''}
          onChange={(value) => onPriceChange(Number(value) || 0)}
          thousandSeparator=" "
          suffix=" сум"
          disabled={readOnly}
        />
      </div>

      <ServiceLinePromo view={promo} />

      <TextInput
        label="Заметка"
        placeholder="Добавьте заметку"
        description={changed ? undefined : 'Необязательно'}
        required={changed}
        value={line.priceChangedReason}
        onChange={(event) => onReasonChange(event.currentTarget.value)}
        disabled={readOnly}
        error={
          changed &&
          line.priceChangedReason.trim().length > 0 &&
          line.priceChangedReason.trim().length < 5
            ? 'Слишком коротко'
            : undefined
        }
      />

      <p className={styles.lineSubtotal}>Итого: {formatPrice(line.quantity * unitFinal)}</p>
    </>
  );
};
