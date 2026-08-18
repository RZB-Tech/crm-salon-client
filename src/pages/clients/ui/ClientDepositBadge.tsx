import React from 'react';
import { formatPrice } from '@/shared/lib/format';
import styles from './client-modals.module.css';

interface ClientDepositBadgeProps {
  amount: number;
}

export const ClientDepositBadge: React.FC<ClientDepositBadgeProps> = ({ amount }) => (
  <span className={styles.depositBadge}>Депозит: {formatPrice(amount)}</span>
);
