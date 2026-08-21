import React from 'react';
import { Badge, Text } from '@mantine/core';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import type { LinePromoView } from '../../lib/appointmentForm';
import styles from './appointment-form-modal.module.css';

interface ServiceLinePromoProps {
  view: LinePromoView;
}

export const ServiceLinePromo: React.FC<ServiceLinePromoProps> = ({ view }) => {
  const { t } = useI18n();
  if (!view.hasPromo) return null;

  return (
    <div className={styles.promoRow}>
      <Badge size="sm" variant="light" color="teal" radius="sm">
        {t('board.promo')}
      </Badge>
      <span className={styles.priceStruck}>{formatPrice(view.base)}</span>
      <span className={styles.priceFinal}>{formatPrice(view.final)}</span>
      {view.preview && (
        <Text span size="xs" c="dimmed">
          {t('board.promoApplies')}
        </Text>
      )}
    </div>
  );
};
