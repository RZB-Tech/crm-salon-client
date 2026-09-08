import React from 'react';
import { Stack } from '@mantine/core';
import type { Appointment } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import styles from './appointment-form-modal.module.css';

interface AppointmentAuditSectionProps {
  appointment: Appointment;
}

export const AppointmentAuditSection: React.FC<AppointmentAuditSectionProps> = ({
  appointment,
}) => {
  const { t } = useI18n();

  return (
    <div className={styles.historySection}>
      <p className={styles.historyTitle}>{t('form.changeHistory')}</p>
      <p className={styles.sectionHint}>{t('board.auditHint')}</p>
      <Stack gap="md">
        <div>
          <p className={styles.historyGroupLabel}>{t('board.visit')}</p>
          <AuditLogsPanel
            tableName="appointments"
            recordId={appointment.id}
            whoLabel={t('form.employee')}
            className={styles.historyTable}
            hideEmptyIcon
          />
        </div>
        {(appointment.records ?? []).map((record) => (
          <div key={record.id}>
            <p className={styles.historyGroupLabel}>
              {t('board.employeeColon')}{' '}
              {record.employee
                ? `${record.employee.firstname} ${record.employee.lastname ?? ''}`.trim()
                : `#${record.id}`}
            </p>
            <AuditLogsPanel
              tableName="appointment_records"
              recordId={record.id}
              whoLabel={t('form.employee')}
              className={styles.historyTable}
              hideEmptyIcon
            />
            {record.services.map((service) => (
              <div key={service.id} style={{ marginTop: 12 }}>
                <p className={styles.historyGroupLabel}>
                  {service.service?.name ??
                    (service.material_id != null
                      ? t('form.productNamed', { id: service.material_id })
                      : t('form.lineNamed', { id: service.id }))}
                </p>
                <AuditLogsPanel
                  tableName="appointment_services"
                  recordId={service.id}
                  whoLabel={t('form.employee')}
                  className={styles.historyTable}
                  hideEmptyIcon
                />
              </div>
            ))}
          </div>
        ))}
      </Stack>
    </div>
  );
};
