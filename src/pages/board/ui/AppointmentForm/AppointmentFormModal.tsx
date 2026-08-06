import React from 'react';
import { CalendarPlus } from '@phosphor-icons/react';
import type { Appointment, Client, Receipt } from '@/shared/api/types';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { FormModal } from '@/shared/ui';
import type { AppointmentFormValues, MaterialOption, ServiceOption } from '../../lib/appointmentForm';
import { AppointmentPaidBadge, AppointmentStateBadges } from './AppointmentFormBadges';
import { AppointmentFormFooter } from './AppointmentFormFooter';
import { AppointmentFormTabs } from './AppointmentFormTabs';
import { AppointmentMainFields } from './AppointmentMainFields';
import { ServiceLinesTable } from './ServiceLinesTable';
import { useAppointmentFormMeta } from './useAppointmentFormMeta';

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

  useResetOnOpen(opened ? `${mode}:${appointment?.id ?? 'new'}` : false, () => setTab('main'));

  const { title, subtitle, avatarInitials, total, isValid, fieldsLocked } = useAppointmentFormMeta({
    mode,
    values,
    clients,
    cancelled,
    archived,
    structureLocked,
  });

  const hasStateBadges = mode === 'edit' && (archived || cancelled || structureLocked);

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
    <FormModal
      opened={opened}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      initials={avatarInitials}
      icon={<CalendarPlus size={22} />}
      headerAside={mode === 'edit' ? <AppointmentPaidBadge paid={paid} /> : undefined}
      badges={
        hasStateBadges ? (
          <AppointmentStateBadges
            archived={archived}
            cancelled={cancelled}
            structureLocked={structureLocked}
            appointment={appointment}
          />
        ) : undefined
      }
      footer={
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
      }
    >
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
    </FormModal>
  );
};
