import React from 'react';
import { Input, SegmentedControl } from '@mantine/core';
import type { AppointmentStatus } from '@/shared/api/types';
import { APPOINTMENT_STATUS_OPTIONS } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import type { AppointmentFormValues } from '../../lib/appointmentForm';
import styles from './appointment-form-modal.module.css';

interface AppointmentStatusFieldProps {
  values: AppointmentFormValues;
  archived: boolean;
  onChange: (values: AppointmentFormValues) => void;
}

export const AppointmentStatusField: React.FC<AppointmentStatusFieldProps> = ({
  values,
  archived,
  onChange,
}) => {
  const { t } = useI18n();
  return (
    <Input.Wrapper className={styles.statusBlock} label={t('common.status')} required>
      <SegmentedControl
        fullWidth
        classNames={{
          root: styles.statusControl,
          indicator: styles.statusIndicator,
          label: styles.statusLabel,
        }}
        data={APPOINTMENT_STATUS_OPTIONS()}
        value={values.status === 'cancelled' ? 'awaiting' : values.status}
        onChange={(value) =>
          onChange({
            ...values,
            status: value as AppointmentStatus,
          })
        }
        disabled={archived}
      />
    </Input.Wrapper>
  );
};
