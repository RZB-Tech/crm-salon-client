import React from 'react';
import { Button } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import styles from './appointment-form-modal.module.css';

interface VisitAddButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const VisitAddButton: React.FC<VisitAddButtonProps> = ({ label, onClick, disabled }) => (
  <Button
    className={styles.ghostAddBtn}
    variant="light"
    size="md"
    radius="xs"
    leftSection={<PlusIcon size={20} />}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </Button>
);
