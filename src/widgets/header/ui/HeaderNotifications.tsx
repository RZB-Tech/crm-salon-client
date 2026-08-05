import React from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Indicator,
  Popover,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { BellIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/shared/api/hooks/useNotifications';
import { useNotificationsWs } from '@/shared/lib/notifications/NotificationsWsContext';
import { getEffectiveStatus } from '@/shared/lib/notifications/notificationDelivery';
import { formatDateTime } from '@/shared/lib/format';
import styles from './header.module.css';

export const HeaderNotifications: React.FC = () => {
  const { connected } = useNotificationsWs();
  const { data: notifications } = useNotifications();

  const recent = React.useMemo(
    () => (notifications ?? []).filter((n) => getEffectiveStatus(n) === 'pending').slice(0, 5),
    [notifications],
  );
  const unreadCount = React.useMemo(
    () => (notifications ?? []).filter((n) => getEffectiveStatus(n) === 'pending').length,
    [notifications],
  );
  const hasUnread = unreadCount > 0;

  return (
    <Popover width={320} position="bottom-end" shadow="md" radius="md">
      <Popover.Target>
        <Indicator
          label={hasUnread ? String(unreadCount) : undefined}
          color="red"
          size={16}
          offset={4}
          disabled={!hasUnread}
          processing={hasUnread}
        >
          <ActionIcon variant="subtle" color="gray" size="lg" aria-label="Уведомления">
            <BellIcon size={20} />
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
                <Box key={item.id} className={styles.notificationItem}>
                  <Text size="sm" fw={500} lineClamp={1}>
                    {item.title ?? 'Уведомление'}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={2}>
                    {item.body}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>
                    {formatDateTime(item.scheduled_at)}
                  </Text>
                </Box>
              ))
            )}
          </ScrollArea.Autosize>
          <Link to="/notifications" className={styles.notificationsLink}>
            Все уведомления
          </Link>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};
