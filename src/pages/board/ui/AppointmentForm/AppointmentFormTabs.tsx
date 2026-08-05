import React from 'react';
import { Tabs } from '@mantine/core';
import type { Appointment } from '@/shared/api/types';
import { PayAppointmentPanel } from '@/shared/ui/PayAppointmentPanel';
import { AppointmentAuditSection } from './AppointmentAuditSection';
import styles from './appointment-form-modal.module.css';

interface AppointmentFormTabsProps {
  appointment: Appointment;
  tab: string;
  onTabChange: (value: string | null) => void;
  mainForm: React.ReactNode;
}

export const AppointmentFormTabs: React.FC<AppointmentFormTabsProps> = ({
  appointment,
  tab,
  onTabChange,
  mainForm,
}) => (
  <Tabs value={tab} onChange={onTabChange} variant="pills" color="sage" radius="xl">
    <Tabs.List className={styles.tabsList}>
      <Tabs.Tab value="main">Запись</Tabs.Tab>
      <Tabs.Tab value="payment">Оплата</Tabs.Tab>
      <Tabs.Tab value="history">История</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="main">{mainForm}</Tabs.Panel>
    <Tabs.Panel value="payment">
      <PayAppointmentPanel appointment={appointment} />
    </Tabs.Panel>
    <Tabs.Panel value="history">
      <AppointmentAuditSection appointment={appointment} />
    </Tabs.Panel>
  </Tabs>
);
