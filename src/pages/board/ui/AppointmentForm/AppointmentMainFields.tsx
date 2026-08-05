import React from 'react';
import { Alert, Textarea } from '@mantine/core';
import type { Client, Receipt } from '@/shared/api/types';
import type { AppointmentFormValues, ServiceOption } from '../../lib/appointmentForm';
import { AppointmentStatusField } from './AppointmentStatusField';
import { AppointmentClientFields } from './AppointmentClientFields';
import { AppointmentScheduleFields } from './AppointmentScheduleFields';
import styles from './appointment-form-modal.module.css';

interface AppointmentMainFieldsProps {
  mode: 'create' | 'edit';
  opened: boolean;
  appointmentId?: number;
  values: AppointmentFormValues;
  clientOptions: { value: string; label: string }[];
  clients: Client[];
  employeeOptions: { value: string; label: string }[];
  serviceOptions: ServiceOption[];
  structureLocked: boolean;
  activeReceipt: Receipt | null;
  fieldsLocked: boolean;
  cancelled: boolean;
  archived: boolean;
  servicesSlot: React.ReactNode;
  onChange: (values: AppointmentFormValues) => void;
}

export const AppointmentMainFields: React.FC<AppointmentMainFieldsProps> = ({
  mode,
  opened,
  values,
  clientOptions,
  clients,
  employeeOptions,
  serviceOptions,
  structureLocked,
  activeReceipt,
  fieldsLocked,
  cancelled,
  archived,
  servicesSlot,
  onChange,
}) => (
  <>
    {structureLocked && (
      <Alert
        className={styles.lockAlert}
        color="yellow"
        variant="light"
        title="Состав заблокирован чеком"
      >
        Чек{activeReceipt ? ` #${activeReceipt.id}` : ''} активен. Отмените его во вкладке
        «Оплата», чтобы менять клиента, время или услуги.
      </Alert>
    )}

    <div className={styles.sectionCard}>
      <p className={styles.sectionTitle}>Визит</p>

      {mode === 'edit' && !cancelled && (
        <AppointmentStatusField values={values} archived={archived} onChange={onChange} />
      )}

      <AppointmentClientFields
        opened={opened}
        values={values}
        clientOptions={clientOptions}
        clients={clients}
        fieldsLocked={fieldsLocked}
        onChange={onChange}
      />

      <AppointmentScheduleFields
        values={values}
        employeeOptions={employeeOptions}
        serviceOptions={serviceOptions}
        fieldsLocked={fieldsLocked}
        onChange={onChange}
      />
    </div>

    {servicesSlot}

    <div className={styles.sectionCardMuted}>
      <p className={styles.sectionTitleMuted}>Комментарий</p>
      <Textarea
        placeholder="Пожелания клиента, детали визита…"
        minRows={2}
        autosize
        value={values.notes}
        onChange={(event) => onChange({ ...values, notes: event.currentTarget.value })}
        disabled={cancelled || archived}
      />
    </div>
  </>
);
