import React from 'react';
import { Group, ActionIcon, Avatar, Text } from '@mantine/core';
import { List, Scissors } from '@phosphor-icons/react';
import styles from './header.module.css';

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggle }) => {
  return (
    <header className={styles.header}>
      <Group gap="md" className={styles.left}>
        <ActionIcon variant="subtle" color="gray" size="lg" onClick={onToggle} aria-label="Toggle sidebar">
          <List size={20} />
        </ActionIcon>

        <Group gap={8} className={styles.logo}>
          <div className={styles.logoIcon}>
            <Scissors size={18} weight="bold" color="white" />
          </div>
          <Text fw={700} size="sm" className={styles.logoText}>
            Salon CRM
          </Text>
        </Group>
      </Group>

      <Group gap="sm" className={styles.right}>
        <Avatar size="sm" radius="md" color="blue">
          CRM
        </Avatar>
      </Group>
    </header>
  );
};
