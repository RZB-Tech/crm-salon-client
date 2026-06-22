import React from 'react';
import { ActionIcon, Avatar, Badge, Group, Indicator, Popover, ScrollArea, Stack, Text } from '@mantine/core';
import { Bell, List, Scissors } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/shared/api/hooks/useNotifications';
import { useNotificationsWs } from '@/shared/lib/notifications/NotificationsWsProvider';
import { formatDateTime } from '@/shared/lib/format';
import styles from './header.module.css';

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggle }) => {
  const { connected } = useNotificationsWs();
  const { data: notifications } = useNotifications();
  const recent = (notifications ?? []).slice(0, 5);

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
        <Popover width={320} position="bottom-end" shadow="md" radius="md">
          <Popover.Target>
            <Indicator color={connected ? 'green' : 'gray'} size={8} offset={4} disabled={!connected}>
              <ActionIcon variant="subtle" color="gray" size="lg" aria-label="Уведомления">
                <Bell size={20} />
              </ActionIcon>
            </Indicator>
          </Popover.Target>
          <Popover.Dropdown p={0}>
            <Stack gap={0}>
              <Group justify="space-between" px="md" py="sm">
                <Text size="sm" fw={600}>
                  Уведомления
                </Text>
                <Badge size="xs" variant="light" color={connected ? 'green' : 'gray'}>
                  {connected ? 'online' : 'offline'}
                </Badge>
              </Group>
              <ScrollArea.Autosize mah={280}>
                {recent.length === 0 ? (
                  <Text size="sm" c="dimmed" px="md" py="sm">
                    Нет уведомлений
                  </Text>
                ) : (
                  recent.map((item) => (
                    <div key={item.id} className={styles.notificationItem}>
                      <Text size="sm" fw={500} lineClamp={1}>
                        {item.title ?? 'Уведомление'}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={2}>
                        {item.body}
                      </Text>
                      <Text size="xs" c="dimmed" mt={4}>
                        {formatDateTime(item.scheduled_at)}
                      </Text>
                    </div>
                  ))
                )}
              </ScrollArea.Autosize>
              <Link to="/notifications" className={styles.notificationsLink}>
                Все уведомления
              </Link>
            </Stack>
          </Popover.Dropdown>
        </Popover>

        <Avatar size="sm" radius="md" color="blue">
          CRM
        </Avatar>
      </Group>
    </header>
  );
};
