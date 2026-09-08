import React from 'react';
import { ActionIcon, Affix } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import styles from './list-create-fab.module.css';

interface ListCreateFabProps {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

export const ListCreateFab: React.FC<ListCreateFabProps> = ({
  label,
  disabled = false,
  loading = false,
  onClick,
}) => (
  <Affix position={{ bottom: 20, right: 20 }} zIndex={50}>
    <ActionIcon
      className={styles.fab}
      size={44}
      radius={28}
      variant="filled"
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      aria-label={label}
    >
      <PlusIcon size={20} />
    </ActionIcon>
  </Affix>
);
