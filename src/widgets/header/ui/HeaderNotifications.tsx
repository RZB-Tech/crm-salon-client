import React from 'react';
import { ActionIcon, Button, Drawer, Popover, ScrollArea } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ArrowSquareOutIcon, BellIcon, BellRingingIcon, XIcon } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/shared/api/hooks/useNotifications';
import { sortTime } from '@/shared/lib/hooks/useTableSort';
import { useI18n } from '@/shared/lib/i18n';
import { getEffectiveStatus } from '@/shared/lib/notifications/notificationDelivery';
import { HeaderNotificationItem } from './HeaderNotificationItem';
import styles from './header-notifications.module.css';

const LIST_LIMIT = 8;
const MOBILE_QUERY = '(max-width: 47.99em)';

export const HeaderNotifications: React.FC = () => {
  const [opened, setOpened] = React.useState(false);
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const navigate = useNavigate();
  const { t } = useI18n();
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

  const openAll = React.useCallback(() => {
    setOpened(false);
    navigate('/notifications');
  }, [navigate]);

  const close = React.useCallback(() => setOpened(false), []);

  const bell = (
    <ActionIcon
      className={styles.bell}
      variant="default"
      radius={8}
      aria-label={t('header.notifications')}
      aria-expanded={opened}
      onClick={() => setOpened((value) => !value)}
    >
      <BellIcon size={16} />
    </ActionIcon>
  );

  const panel = (
    <>
      {isMobile && <div className={styles.handle} />}
      <div className={styles.header}>
        <div className={styles.headerLead}>
          <div className={styles.headerIcon}>
            <BellIcon size={20} />
          </div>
          <h2 className={styles.title}>{t('header.notifications')}</h2>
        </div>
        <div className={styles.headerActions}>
          {!isMobile && (
            <ActionIcon
              className={styles.iconBtn}
              variant="subtle"
              size={32}
              radius={8}
              aria-label={t('header.allNotifications')}
              onClick={openAll}
            >
              <ArrowSquareOutIcon size={20} />
            </ActionIcon>
          )}
          <ActionIcon
            className={styles.closeBtn}
            variant="default"
            size={32}
            radius={8}
            aria-label={t('header.close')}
            onClick={close}
          >
            <XIcon size={20} />
          </ActionIcon>
        </div>
      </div>
      <ScrollArea.Autosize mah={isMobile ? (items.length === 0 ? 360 : 420) : 360} type="auto">
        <div className={styles.list}>
          {items.length === 0 ? (
            isMobile ? (
              <div className={styles.emptyState}>
                <BellRingingIcon className={styles.emptyIcon} size={76} />
                <div>
                  <p className={styles.emptyTitle}>{t('header.emptyTitle')}</p>
                  <p className={styles.emptyHint}>{t('header.emptyHint')}</p>
                </div>
              </div>
            ) : (
              <div className={styles.empty}>{t('header.noNotifications')}</div>
            )
          ) : (
            items.map((item) => <HeaderNotificationItem key={item.id} item={item} />)
          )}
        </div>
      </ScrollArea.Autosize>
      {isMobile && (
        <div className={styles.sheetFooter}>
          <Button className={styles.allBtn} fullWidth onClick={openAll}>
            {t('header.allNotifications')}
          </Button>
        </div>
      )}
    </>
  );

  if (isMobile) {
    return (
      <>
        {bell}
        <Drawer
          opened={opened}
          onClose={close}
          position="bottom"
          size="auto"
          padding={0}
          radius={24}
          withCloseButton={false}
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          classNames={{ content: styles.sheet }}
          styles={{
            content: {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              overflow: 'hidden',
            },
          }}
          transitionProps={{ duration: 380, timingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {panel}
        </Drawer>
      </>
    );
  }

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      width={423}
      position="bottom-end"
      radius={16}
      shadow="none"
      offset={8}
      withinPortal
      zIndex={400}
    >
      <Popover.Target>{bell}</Popover.Target>
      <Popover.Dropdown className={styles.dropdown} p={0}>
        {panel}
      </Popover.Dropdown>
    </Popover>
  );
};
