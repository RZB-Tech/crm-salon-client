import React from 'react';
import { ActionIcon, Avatar } from '@mantine/core';
import { ArchiveIcon, ArrowCounterClockwiseIcon, CakeIcon, PhoneIcon } from '@phosphor-icons/react';
import type { Client } from '@/shared/api/types';
import { ListEntityCard } from '@/shared/ui';
import {
  formatDate,
  formatPrice,
  getClientFullName,
  getClientInitials,
  SEX_LABELS,
} from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import styles from './client-mobile-card.module.css';

interface ClientMobileCardProps {
  client: Client;
  showArchived: boolean;
  canManage: boolean;
  onOpen: (client: Client) => void;
  onArchive: (event: React.MouseEvent, clientId: number) => void;
  onRestore: (event: React.MouseEvent, clientId: number) => void;
}

export const ClientMobileCard: React.FC<ClientMobileCardProps> = ({
  client,
  showArchived,
  canManage,
  onOpen,
  onArchive,
  onRestore,
}) => {
  const { t } = useI18n();

  return (
    <ListEntityCard onClick={showArchived ? undefined : () => onOpen(client)}>
      <div className={styles.top}>
        <Avatar className={styles.avatar} radius={8} size={40} color="sage">
          {getClientInitials(client)}
        </Avatar>
        <div className={styles.nameBlock}>
          <p className={styles.name}>{getClientFullName(client)}</p>
          <div className={styles.sex}>
            <span className={styles.sexLabel}>{t('clients.sex')}: </span>
            {SEX_LABELS[client.sex] ?? client.sex}
          </div>
        </div>
      </div>
      {client.phone && (
        <div className={styles.meta}>
          <PhoneIcon size={16} />
          {client.phone}
        </div>
      )}
      {client.birth_date && (
        <div className={styles.meta}>
          <CakeIcon size={16} />
          {formatDate(client.birth_date)}
        </div>
      )}
      <div className={styles.footer}>
        <div className={styles.meta}>
          <span className={styles.depositLabel}>{t('clients.deposit')}: </span>
          {formatPrice(client.deposit)}
        </div>
        {canManage &&
          (showArchived ? (
            <ActionIcon
              className={styles.archiveBtn}
              variant="subtle"
              color="teal"
              aria-label={t('common.restore')}
              onClick={(event) => {
                event.stopPropagation();
                onRestore(event, client.id);
              }}
            >
              <ArrowCounterClockwiseIcon size={16} />
            </ActionIcon>
          ) : (
            <ActionIcon
              className={styles.archiveBtn}
              variant="default"
              aria-label={t('common.archive')}
              onClick={(event) => {
                event.stopPropagation();
                onArchive(event, client.id);
              }}
            >
              <ArchiveIcon size={16} />
            </ActionIcon>
          ))}
      </div>
    </ListEntityCard>
  );
};
