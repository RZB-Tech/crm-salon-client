import React from 'react';
import { AuditLogsPanel } from '@/shared/ui/AuditLogsPanel';
import styles from './client-modals.module.css';

interface ClientHistoryTabProps {
  clientId: number;
}

export const ClientHistoryTab: React.FC<ClientHistoryTabProps> = ({ clientId }) => (
  <div className={styles.tableBlock}>
    <p className={styles.tableLabel}>История изменений</p>
    <AuditLogsPanel
      tableName="clients"
      recordId={clientId}
      whoLabel="Сотрудник"
      className={styles.tableCard}
      hideEmptyIcon
    />
  </div>
);
