import React from 'react';
import { UserCheckIcon } from '@phosphor-icons/react';
import type { Appointment, Client, Receipt } from '@/shared/api/types';
import { usePromotions } from '@/shared/api/hooks/usePromotions';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { FormModal } from '@/shared/ui';
import type { PaymentFooterActions } from '@/shared/ui/PayAppointmentPanel';
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
  const [paymentFooter, setPaymentFooter] = React.useState<PaymentFooterActions | null>(null);

  useResetOnOpen(opened ? `${mode}:${appointment?.id ?? 'new'}` : false, () => setTab('main'));

  const { isAdmin, hasPermission } = useAccess();
  const canReadPromos = isAdmin || hasPermission(PermissionCode.PROMOTION_GET);
  const { data: promotions } = usePromotions(false, canReadPromos);

  const { title, subtitle, isValid, fieldsLocked } = useAppointmentFormMeta({
    mode,
    values,
    clients,
    promotions: promotions ?? [],
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
          promotions={promotions ?? []}
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
      icon={<UserCheckIcon />}
      size={567}
      badges={
        mode === 'edit' ? (
          <>
            <AppointmentPaidBadge paid={paid} />
            {hasStateBadges && (
              <AppointmentStateBadges
                archived={archived}
                cancelled={cancelled}
                structureLocked={structureLocked}
                appointment={appointment}
              />
            )}
          </>
        ) : undefined
      }
      footer={
        <AppointmentFormFooter
          mode={mode}
          tab={tab}
          isValid={isValid}
          loading={loading}
          cancelled={cancelled}
          archived={archived}
          paid={paid}
          structureLocked={structureLocked}
          paymentSubmit={tab === 'payment' ? paymentFooter : null}
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
          onPaymentFooterChange={setPaymentFooter}
          mainForm={mainForm}
        />
      ) : (
        mainForm
      )}
    </FormModal>
  );
};
