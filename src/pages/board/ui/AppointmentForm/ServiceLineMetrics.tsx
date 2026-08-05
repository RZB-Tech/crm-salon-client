import React from 'react';
import { NumberInput, Textarea } from '@mantine/core';
import { formatPrice } from '@/shared/lib/format';
import { isLineFilled, isPriceChanged, type AppointmentServiceLine } from '../../lib/appointmentForm';
import styles from './appointment-form-modal.module.css';

interface ServiceLineMetricsProps {
  line: AppointmentServiceLine;
  readOnly: boolean;
  onQuantityChange: (quantity: number) => void;
  onPriceChange: (price: number) => void;
  onReasonChange: (reason: string) => void;
}

export const ServiceLineMetrics: React.FC<ServiceLineMetricsProps> = ({
  line,
  readOnly,
  onQuantityChange,
  onPriceChange,
  onReasonChange,
}) => {
  const changed = isPriceChanged(line);
  const showExtras = changed || Boolean(line.priceChangedReason.trim()) || !readOnly;

  return (
    <>
      <div className={styles.lineMetrics} style={{ marginTop: 8 }}>
        <NumberInput
          label="Кол-во"
          min={1}
          value={line.quantity}
          onChange={(value) => onQuantityChange(Number(value) || 1)}
          disabled={readOnly}
        />
        <NumberInput
          label="Цена"
          min={0}
          value={line.price}
          onChange={(value) => onPriceChange(Number(value) || 0)}
          thousandSeparator=" "
          suffix=" сум"
          disabled={readOnly}
        />
      </div>

      {isLineFilled(line) && (
        <div className={styles.lineSubtotal}>
          Сумма позиции: {formatPrice(line.quantity * line.price)}
          {changed && ' · цена изменена'}
        </div>
      )}

      {showExtras && (
        <div className={styles.lineExtras}>
          <Textarea
            label="Заметка"
            placeholder={changed ? 'Обязательно, минимум 5 символов' : 'Необязательно'}
            required={changed}
            minRows={1}
            autosize
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
        </div>
      )}
    </>
  );
};
