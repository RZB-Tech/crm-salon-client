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
  const handleEmployeeChange = React.useCallback(
    (employeeId: string | null) => {
      onChange({ ...values, employeeId, services: [createEmptyServiceLine()] });
    },
    [onChange, values],
  );

  return (
    <>
      <div className={styles.scheduleGrid} style={{ marginTop: 12 }}>
        <DateInput
          label="Дата"
          required
          value={values.date || null}
          onChange={(value) => onChange({ ...values, date: value ?? '' })}
          disabled={fieldsLocked}
        />
        <TimePicker
          label="Начало"
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
          label="Конец"
          required
          minutesStep={15}
          value={values.endTime}
          onChange={(value) => onChange({ ...values, endTime: value })}
          disabled={fieldsLocked}
          error={values.startTime >= values.endTime ? 'Конец должен быть позже начала' : undefined}
        />
      </div>

      <Select
        label="Сотрудник"
        required
        searchable
        mt="sm"
        data={employeeOptions}
        value={values.employeeId}
        onChange={handleEmployeeChange}
        disabled={fieldsLocked}
        placeholder="Кто принимает"
      />
    </>
  );
};
