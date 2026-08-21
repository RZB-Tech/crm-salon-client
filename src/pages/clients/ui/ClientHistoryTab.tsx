import React from 'react';
import { useI18n } from '@/shared/lib/i18n';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import styles from './client-modals.module.css';

interface ClientHistoryTabProps {
  clientId: number;
}

export const ClientHistoryTab: React.FC<ClientHistoryTabProps> = ({ clientId }) => {
  const { t } = useI18n();
  return (
    <div className={styles.tableBlock}>
      <p className={styles.tableLabel}>{t('form.changeHistory')}</p>
      <AuditLogsPanel
        tableName="clients"
        recordId={clientId}
        whoLabel={t('form.employee')}
        className={styles.tableCard}
        hideEmptyIcon
      />
    </div>
  );
};
