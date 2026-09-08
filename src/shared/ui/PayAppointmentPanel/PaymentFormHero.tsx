import React from 'react';
import { Text } from '@mantine/core';
import { Wallet } from '@phosphor-icons/react';
import type { Appointment, Receipt } from '@/shared/api/types';
import { formatPrice } from '@/shared/lib/format';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { PaymentStepper } from './PaymentStepper';
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
}) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  return (
  <>
    <div className={styles.payHero}>
      <div className={styles.payHeroText}>
        <div className={styles.payHeroLabel}>{t('finance.due')}</div>
        <div className={styles.payHeroAmount}>
          {formatPrice(receipt?.remaining_amount ?? appointment.total_price)}
        </div>
        {receipt && receipt.paid_amount > 0 && (
          <Text className={styles.payHeroHint} size="xs" c="dimmed" mt={4}>
            {t('finance.alreadyPaid', {
              paid: formatPrice(receipt.paid_amount),
              total: formatPrice(receipt.total_amount),
            })}
          </Text>
        )}
      </div>
      <Wallet className={styles.payHeroIcon} size={28} color="var(--mantine-color-sage-7)" />
    </div>

    {isMobile ? (
      receipt ? (
        <PaymentStepper step1Done={step1Done} step2Done={step2Done} step3Done={step3Done} />
      ) : null
    ) : (
      <div className={`${styles.paySteps}${receipt ? '' : ` ${styles.payStepsPreview}`}`}>
        <span className={`${styles.payStep} ${step1Done ? styles.payStepDone : styles.payStepActive}`}>
          {t('finance.stepComposition')}
        </span>
        <span
          className={`${styles.payStep} ${
            step2Done ? styles.payStepDone : step1Done ? styles.payStepActive : ''
          }`}
        >
          {t('finance.stepReceipt')}
        </span>
        <span
          className={`${styles.payStep} ${
            step3Done ? styles.payStepDone : step2Done ? styles.payStepActive : ''
          }`}
        >
          {t('finance.stepPay')}
        </span>
      </div>
    )}
  </>
  );
};
