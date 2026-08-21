import React from 'react';
import { NumberInput, TextInput } from '@mantine/core';
import type { Promotion } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
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
  const { t } = useI18n();
  const changed = isPriceChanged(line);
  const promo = getLinePromoView(line, promotions);
  const unitFinal = promo.final;

  return (
    <>
      <div className={styles.lineMetrics}>
        <NumberInput
          label={t('board.quantity')}
          min={1}
          placeholder="1"
          value={line.quantity}
          onChange={(value) => onQuantityChange(Number(value) || 1)}
          disabled={readOnly}
        />
        <NumberInput
          label={t('services.price')}
          min={0}
          placeholder={t('board.pricePlaceholder')}
          value={line.price || ''}
          onChange={(value) => onPriceChange(Number(value) || 0)}
          thousandSeparator=" "
          suffix={` ${t('common.currency')}`}
          disabled={readOnly}
        />
      </div>

      <ServiceLinePromo view={promo} />

      <TextInput
        label={t('board.note')}
        placeholder={t('board.addNote')}
        description={changed ? undefined : t('common.optional')}
        required={changed}
        value={line.priceChangedReason}
        onChange={(event) => onReasonChange(event.currentTarget.value)}
        disabled={readOnly}
        error={
          changed &&
          line.priceChangedReason.trim().length > 0 &&
          line.priceChangedReason.trim().length < 5
            ? t('board.tooShort')
            : undefined
        }
      />

      <p className={styles.lineSubtotal}>{t('board.total')} {formatPrice(line.quantity * unitFinal)}</p>
    </>
  );
};
