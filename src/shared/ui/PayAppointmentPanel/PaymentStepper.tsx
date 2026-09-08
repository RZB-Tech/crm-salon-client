import React from 'react';
import { useI18n } from '@/shared/lib/i18n';
import styles from './pay-appointment-panel.module.css';

interface PaymentStepperProps {
  step1Done: boolean;
  step2Done: boolean;
  step3Done: boolean;
}

export const PaymentStepper: React.FC<PaymentStepperProps> = ({
  step1Done,
  step2Done,
  step3Done,
}) => {
  const { t } = useI18n();
  const steps = React.useMemo(
    () => [
      { n: 1, label: t('finance.stepCompositionShort'), done: step1Done },
      { n: 2, label: t('finance.stepReceiptShort'), done: step2Done },
      { n: 3, label: t('finance.stepPayShort'), done: step3Done },
    ],
    [step1Done, step2Done, step3Done, t],
  );

  return (
    <div className={styles.payStepper} aria-hidden>
      {steps.map((step, index) => (
        <React.Fragment key={step.n}>
          {index > 0 && <span className={styles.payStepperLine} />}
          <div className={`${styles.payStepperStep}${step.done ? ` ${styles.payStepperStepDone}` : ''}`}>
            <span className={styles.payStepperNum}>{step.n}</span>
            <span className={styles.payStepperLabel}>{step.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
