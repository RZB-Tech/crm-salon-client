import React from 'react';
import { Select } from '@mantine/core';
import { DateInput, TimePicker } from '@mantine/dates';
import {
  applyStartTimeChange,
  calcTotalEstimatedTime,
  createEmptyServiceLine,
  type AppointmentFormValues,
  type ServiceOption,
} from '../../lib/appointmentForm';
import { useI18n } from '@/shared/lib/i18n';
import styles from './appointment-form-modal.module.css';

interface AppointmentScheduleFieldsProps {
  values: AppointmentFormValues;
  employeeOptions: { value: string; label: string }[];
  serviceOptions: ServiceOption[];
  fieldsLocked: boolean;
  onChange: (values: AppointmentFormValues) => void;
}

export const AppointmentScheduleFields: React.FC<AppointmentScheduleFieldsProps> = ({
  values,
  employeeOptions,
  serviceOptions,
  fieldsLocked,
  onChange,
}) => {
  const { t } = useI18n();
  const handleEmployeeChange = React.useCallback(
    (employeeId: string | null) => {
      onChange({ ...values, employeeId, services: [createEmptyServiceLine()] });
    },
    [onChange, values],
  );

  return (
    <>
      <div className={styles.scheduleGrid}>
        <DateInput
          label={t('form.date')}
          required
          placeholder={t('board.datePlaceholder')}
          value={values.date || null}
          onChange={(value) => onChange({ ...values, date: value ?? '' })}
          disabled={fieldsLocked}
        />
        <TimePicker
          label={t('board.start')}
          required
          minutesStep={15}
          value={values.startTime}
          onChange={(value) =>
            onChange(
              applyStartTimeChange(
                values,
                value,
                calcTotalEstimatedTime(values.services, serviceOptions),
              ),
            )
          }
          disabled={fieldsLocked}
        />
        <TimePicker
          label={t('board.end')}
          required
          minutesStep={15}
          value={values.endTime}
          onChange={(value) => onChange({ ...values, endTime: value })}
          disabled={fieldsLocked}
          error={values.startTime >= values.endTime ? t('board.endAfterStart') : undefined}
        />
      </div>

      <Select
        label={t('form.employee')}
        searchable
        data={employeeOptions}
        value={values.employeeId}
        onChange={handleEmployeeChange}
        disabled={fieldsLocked}
        placeholder={t('board.selectEmployee')}
      />
    </>
  );
};
