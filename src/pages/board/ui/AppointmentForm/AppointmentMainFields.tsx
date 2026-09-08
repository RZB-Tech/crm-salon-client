import React from 'react';
import { Alert, Textarea } from '@mantine/core';
import type { Client, Receipt } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
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
}) => {
  const { t } = useI18n();
  const body = (
    <>
      {structureLocked && (
        <Alert
          className={styles.lockAlert}
          color="red"
          variant="light"
          title={t('board.linesLocked')}
        >
          {t('board.linesLockedHint', { id: activeReceipt ? ` №${activeReceipt.id}` : '' })}
        </Alert>
      )}

      <div className={styles.sectionCard}>
        <p className={styles.sectionTitle}>{t('clients.personalData')}</p>

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

      <Textarea
        label={t('common.comment')}
        placeholder={t('board.addComment')}
        minRows={2}
        autosize
        value={values.notes}
        onChange={(event) => onChange({ ...values, notes: event.currentTarget.value })}
        disabled={cancelled || archived}
      />
    </>
  );

  return mode === 'create' ? <div className={styles.createLayout}>{body}</div> : body;
};
