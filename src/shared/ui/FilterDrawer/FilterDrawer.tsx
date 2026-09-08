import React from 'react';
import { Drawer } from '@mantine/core';
import { FunnelIcon } from '@phosphor-icons/react';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { FormModalHeader } from '../FormModal';
import styles from './filter-drawer.module.css';

interface FilterDrawerProps {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  opened,
  onClose,
  title,
  children,
  footer,
}) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position={isMobile ? 'bottom' : 'right'}
      withCloseButton={false}
      padding={0}
      size={isMobile ? '84%' : 400}
      radius={isMobile ? 24 : 0}
      overlayProps={
        isMobile
          ? { backgroundOpacity: 0.5, blur: 4 }
          : { backgroundOpacity: 0.08, blur: 3 }
      }
      classNames={{
        content: isMobile ? styles.sheet : styles.panel,
        body: styles.body,
      }}
      styles={
        isMobile
          ? {
              content: {
                overflow: 'hidden',
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            }
          : undefined
      }
    >
      {isMobile && <div className={styles.handle} />}
      <div className={styles.top}>
        <FormModalHeader title={title ?? t('common.filters')} icon={<FunnelIcon />} onClose={onClose} />
        <div className={styles.fields}>{children}</div>
      </div>
      {footer}
    </Drawer>
  );
};
