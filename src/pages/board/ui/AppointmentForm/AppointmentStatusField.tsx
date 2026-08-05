import React from 'react';
import { SegmentedControl, Text } from '@mantine/core';
import type { AppointmentStatus } from '@/shared/api/types';
import { APPOINTMENT_STATUS_OPTIONS } from '@/shared/lib/format';
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
}) => (
  <div className={styles.statusBlock}>
    <Text size="xs" c="dimmed" mb={6}>
      Статус
    </Text>
    <SegmentedControl
      fullWidth
      data={APPOINTMENT_STATUS_OPTIONS}
      value={values.status === 'cancelled' ? 'awaiting' : values.status}
      onChange={(value) =>
        onChange({
          ...values,
          status: value as AppointmentStatus,
        })
      }
      disabled={archived}
    />
  </div>
);
