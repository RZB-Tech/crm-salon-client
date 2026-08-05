import React from 'react';
import { Modal } from '@mantine/core';
import type { Appointment, Client, Receipt } from '@/shared/api/types';
import type { AppointmentFormValues, MaterialOption, ServiceOption } from '../../lib/appointmentForm';
import { AppointmentFormFooter } from './AppointmentFormFooter';
import { AppointmentFormHeader } from './AppointmentFormHeader';
import { AppointmentFormTabs } from './AppointmentFormTabs';
import { AppointmentMainFields } from './AppointmentMainFields';
import { ServiceLinesTable } from './ServiceLinesTable';
import { useAppointmentFormMeta } from './useAppointmentFormMeta';
import styles from './appointment-form-modal.module.css';

interface AppointmentFormModalProps {
  opened: boolean;
  mode: 'create' | 'edit';
  loading?: boolean;
  paid?: boolean;
  cancelled?: boolean;
  archived?: boolean;
  structureLocked?: boolean;
  activeReceipt?: Receipt | null;
  appointment?: Appointment | null;
  values: AppointmentFormValues;
  clientOptions: { value: string; label: string }[];
  clients: Client[];
  employeeOptions: { value: string; label: string }[];
  serviceOptions: ServiceOption[];
  materialOptions: MaterialOption[];
  onChange: (values: AppointmentFormValues) => void;
  onClose: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  onRestore?: () => void;
  onCancel?: () => void;
}

export type { AppointmentFormValues };

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = (props) => {
  const {
    opened,
    mode,
    loading = false,
    paid = false,
    cancelled = false,
    archived = false,
    structureLocked = false,
    activeReceipt = null,
    appointment = null,
    values,
    clientOptions,
    clients,
    employeeOptions,
    serviceOptions,
    materialOptions,
    onChange,
    onClose,
    onSubmit,
    onDelete,
    onRestore,
    onCancel,
  } = props;

  const [tab, setTab] = React.useState('main');
  const [renderKey, setRenderKey] = React.useState(0);

  React.useEffect(() => {
    if (opened) setTab('main');
  }, [opened, mode, appointment?.id]);

  const { title, subtitle, avatarInitials, total, isValid, fieldsLocked } = useAppointmentFormMeta({
    mode,
    values,
    clients,
    cancelled,
    archived,
    structureLocked,
  });

  const mainForm = (
    <AppointmentMainFields
      mode={mode}
      opened={opened}
      appointmentId={appointment?.id}
      values={values}
      clientOptions={clientOptions}
      clients={clients}
      employeeOptions={employeeOptions}
      serviceOptions={serviceOptions}
      structureLocked={structureLocked}
      activeReceipt={activeReceipt}
      fieldsLocked={fieldsLocked}
      cancelled={cancelled}
      archived={archived}
      servicesSlot={
        <ServiceLinesTable
          values={values}
          serviceOptions={serviceOptions}
          materialOptions={materialOptions}
          onChange={onChange}
          readOnly={fieldsLocked}
        />
      }
      onChange={onChange}
    />
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      title={null}
      radius="lg"
      size="lg"
      padding={0}
      transitionProps={{
        transition: 'pop',
        duration: 220,
        onEntered: () => setRenderKey((key) => key + 1),
      }}
    >
      <div className={styles.modalBody} key={renderKey}>
        <AppointmentFormHeader
          mode={mode}
          title={title}
          subtitle={subtitle}
          avatarInitials={avatarInitials}
          paid={paid}
          archived={archived}
          cancelled={cancelled}
          structureLocked={structureLocked}
          appointment={appointment}
          onClose={onClose}
        />

        <div className={styles.content}>
          {mode === 'edit' && appointment ? (
            <AppointmentFormTabs
              appointment={appointment}
              tab={tab}
              onTabChange={(value) => setTab(value ?? 'main')}
              mainForm={mainForm}
            />
          ) : (
            mainForm
          )}
        </div>

        <AppointmentFormFooter
          mode={mode}
          tab={tab}
          total={total}
          isValid={isValid}
          loading={loading}
          cancelled={cancelled}
          archived={archived}
          paid={paid}
          structureLocked={structureLocked}
          onClose={onClose}
          onSubmit={onSubmit}
          onDelete={onDelete}
          onRestore={onRestore}
          onCancel={onCancel}
        />
      </div>
    </Modal>
  );
};
