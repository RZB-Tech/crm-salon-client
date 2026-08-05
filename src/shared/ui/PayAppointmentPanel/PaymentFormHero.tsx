import React from 'react';
import { Text } from '@mantine/core';
import { Wallet } from '@phosphor-icons/react';
import type { Appointment, Receipt } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import styles from './pay-appointment-panel.module.css';

interface PaymentFormHeroProps {
  appointment: Appointment;
  receipt: Receipt | null | undefined;
  step1Done: boolean;
  step2Done: boolean;
  step3Done: boolean;
}

export const PaymentFormHero: React.FC<PaymentFormHeroProps> = ({
  appointment,
  receipt,
  step1Done,
  step2Done,
  step3Done,
}) => (
  <>
    <div className={styles.payHero}>
      <div>
        <div className={styles.payHeroLabel}>К оплате</div>
        <div className={styles.payHeroAmount}>
          {formatPrice(receipt?.remaining_amount ?? appointment.total_price)}
        </div>
        {receipt && receipt.paid_amount > 0 && (
          <Text size="xs" c="dimmed" mt={4}>
            Уже оплачено {formatPrice(receipt.paid_amount)} из {formatPrice(receipt.total_amount)}
          </Text>
        )}
      </div>
      <Wallet size={28} color="var(--mantine-color-sage-7)" />
    </div>

    <div className={styles.paySteps}>
      <span className={`${styles.payStep} ${step1Done ? styles.payStepDone : styles.payStepActive}`}>
        1. Состав
      </span>
      <span
        className={`${styles.payStep} ${
          step2Done ? styles.payStepDone : step1Done ? styles.payStepActive : ''
        }`}
      >
        2. Чек
      </span>
      <span
        className={`${styles.payStep} ${
          step3Done ? styles.payStepDone : step2Done ? styles.payStepActive : ''
        }`}
      >
        3. Оплата
      </span>
    </div>
  </>
);
