import React from 'react';
import { ActionIcon, Affix } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import { useI18n } from '@/shared/lib/i18n';
import styles from './board-create-fab.module.css';

interface BoardCreateFabProps {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}

export const BoardCreateFab: React.FC<BoardCreateFabProps> = ({ disabled, loading, onClick }) => {
  const { t } = useI18n();

  return (
    <Affix position={{ bottom: 20, right: 20 }} zIndex={50}>
      <ActionIcon
        className={styles.fab}
        size={44}
        radius={28}
        variant="filled"
        onClick={onClick}
        disabled={disabled}
        loading={loading}
        aria-label={t('board.newAppointment')}
      >
        <PlusIcon size={20} />
      </ActionIcon>
    </Affix>
  );
};
