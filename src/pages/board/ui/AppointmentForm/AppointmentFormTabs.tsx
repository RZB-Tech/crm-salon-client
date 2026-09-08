import React from 'react';
import { Tabs } from '@mantine/core';
import type { Appointment } from '@/shared/api/types';
import { PayAppointmentPanel, type PaymentFooterActions } from '@/shared/ui/PayAppointmentPanel';
import { useI18n } from '@/shared/lib/i18n';
import { AppointmentAuditSection } from './AppointmentAuditSection';
import styles from './appointment-form-modal.module.css';

interface AppointmentFormTabsProps {
  appointment: Appointment;
  tab: string;
  onTabChange: (value: string | null) => void;
  mainForm: React.ReactNode;
  onPaymentFooterChange?: (actions: PaymentFooterActions | null) => void;
}

export const AppointmentFormTabs: React.FC<AppointmentFormTabsProps> = ({
  appointment,
  tab,
  onTabChange,
  mainForm,
  onPaymentFooterChange,
}) => {
  const { t } = useI18n();
  return (
  <Tabs
    value={tab}
    onChange={onTabChange}
    variant="pills"
    radius={4}
    classNames={{ list: styles.tabsList, tab: styles.tab }}
  >
    <Tabs.List className={styles.tabsList}>
      <Tabs.Tab value="main">{t('board.tabAppointment')}</Tabs.Tab>
      <Tabs.Tab value="payment">{t('board.tabPayment')}</Tabs.Tab>
      <Tabs.Tab value="history">{t('board.tabHistory')}</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="main">{mainForm}</Tabs.Panel>
    <Tabs.Panel value="payment">
      <PayAppointmentPanel appointment={appointment} onPaymentFooterChange={onPaymentFooterChange} />
    </Tabs.Panel>
    <Tabs.Panel value="history">
      <AppointmentAuditSection appointment={appointment} />
    </Tabs.Panel>
  </Tabs>
  );
};
