import React from 'react';
import { ActionIcon, Popover, ScrollArea } from '@mantine/core';
import { ArrowSquareOutIcon, BellIcon, XIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/shared/api/hooks/useNotifications';
import { sortTime } from '@/shared/lib/hooks/useTableSort';
import { getEffectiveStatus } from '@/shared/lib/notifications/notificationDelivery';
import { HeaderNotificationItem } from './HeaderNotificationItem';
import styles from './header-notifications.module.css';

const LIST_LIMIT = 8;

export const HeaderNotifications: React.FC = () => {
  const [opened, setOpened] = React.useState(false);
  const navigate = useNavigate();
  const { data: notifications } = useNotifications();

  const items = React.useMemo(() => {
    return (notifications ?? [])
      .filter((item) => getEffectiveStatus(item) !== 'cancelled')
      .sort((a, b) => {
        const unreadA = getEffectiveStatus(a) === 'pending' ? 0 : 1;
        const unreadB = getEffectiveStatus(b) === 'pending' ? 0 : 1;
        if (unreadA !== unreadB) return unreadA - unreadB;
        return (sortTime(b.scheduled_at) ?? 0) - (sortTime(a.scheduled_at) ?? 0);
      })
      .slice(0, LIST_LIMIT);
  }, [notifications]);

  const openAll = () => {
    setOpened(false);
    navigate('/notifications');
  };

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      width={423}
      position="bottom-end"
      radius={16}
      shadow="none"
      offset={8}
    >
      <Popover.Target>
        <ActionIcon
          className={styles.bell}
          variant="default"
          size={32}
          radius={8}
          aria-label="Уведомления"
          aria-expanded={opened}
        >
          <BellIcon size={16} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown className={styles.dropdown} p={0}>
        <div className={styles.header}>
          <div className={styles.headerLead}>
            <div className={styles.headerIcon}>
              <BellIcon size={20} />
            </div>
            <h2 className={styles.title}>Уведомления</h2>
          </div>
          <div className={styles.headerActions}>
            <ActionIcon
              className={styles.iconBtn}
              variant="subtle"
              size={32}
              radius={8}
              aria-label="Все уведомления"
              onClick={openAll}
            >
              <ArrowSquareOutIcon size={20} />
            </ActionIcon>
            <ActionIcon
              className={styles.closeBtn}
              variant="default"
              size={32}
              radius={8}
              aria-label="Закрыть"
              onClick={() => setOpened(false)}
            >
              <XIcon size={20} />
            </ActionIcon>
          </div>
        </div>
        <ScrollArea.Autosize mah={360} type="auto">
          <div className={styles.list}>
            {items.length === 0 ? (
              <div className={styles.empty}>Нет уведомлений</div>
            ) : (
              items.map((item) => <HeaderNotificationItem key={item.id} item={item} />)
            )}
          </div>
        </ScrollArea.Autosize>
      </Popover.Dropdown>
    </Popover>
  );
};
