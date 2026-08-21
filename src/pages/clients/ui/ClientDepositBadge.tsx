import React from 'react';
import { formatPrice } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import styles from './client-modals.module.css';

interface ClientDepositBadgeProps {
  amount: number;
}

export const ClientDepositBadge: React.FC<ClientDepositBadgeProps> = ({ amount }) => {
  const { t } = useI18n();
  return (
    <span className={styles.depositBadge}>
      {t('clients.depositLabel', { amount: formatPrice(amount) })}
    </span>
  );
};
