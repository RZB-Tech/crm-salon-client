import React from 'react';
import { Select } from '@mantine/core';
import { Phone } from '@phosphor-icons/react';
import type { Client } from '@/shared/api/types';
import type { AppointmentFormValues } from '../../lib/appointmentForm';
import { useI18n } from '@/shared/lib/i18n';
import { QuickClientForm } from './QuickClientForm';
import { VisitAddButton } from './VisitAddButton';
import styles from './appointment-form-modal.module.css';

interface AppointmentClientFieldsProps {
  opened: boolean;
  values: AppointmentFormValues;
  clientOptions: { value: string; label: string }[];
  clients: Client[];
  fieldsLocked: boolean;
  onChange: (values: AppointmentFormValues) => void;
}

export const AppointmentClientFields: React.FC<AppointmentClientFieldsProps> = ({
  opened,
  values,
  clientOptions,
  clients,
  fieldsLocked,
  onChange,
}) => {
  const { t } = useI18n();
  const [showQuickClient, setShowQuickClient] = React.useState(false);

  React.useEffect(() => {
    if (opened) setShowQuickClient(false);
  }, [opened]);

  const selectedClient = React.useMemo(
    () => clients.find((client) => String(client.id) === values.clientId),
    [clients, values.clientId],
  );

  return (
    <>
      <div className={styles.clientRow}>
        <Select
          label={t('form.client')}
          required
          searchable
          data={clientOptions}
          value={values.clientId}
          onChange={(value) => onChange({ ...values, clientId: value })}
          className={styles.clientSelect}
          disabled={fieldsLocked}
          placeholder={t('form.selectClient')}
        />
        {!fieldsLocked && !showQuickClient && (
          <VisitAddButton label={t('form.client')} onClick={() => setShowQuickClient(true)} />
        )}
      </div>

      {!fieldsLocked && showQuickClient && (
        <QuickClientForm
          onCreated={(id) => {
            onChange({ ...values, clientId: id });
            setShowQuickClient(false);
          }}
          onCancel={() => setShowQuickClient(false)}
        />
      )}

      {selectedClient?.phone && (
        <div className={styles.clientMeta}>
          <Phone size={14} color="#6e483c" />
          <span className={styles.clientPhone}>{selectedClient.phone}</span>
        </div>
      )}
    </>
  );
};
