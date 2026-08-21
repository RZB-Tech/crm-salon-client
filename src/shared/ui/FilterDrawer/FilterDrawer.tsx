import React from 'react';
import { Drawer } from '@mantine/core';
import { FunnelIcon } from '@phosphor-icons/react';
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
  return (
  <Drawer
    opened={opened}
    onClose={onClose}
    position="right"
    withCloseButton={false}
    padding={0}
    size={400}
    overlayProps={{ backgroundOpacity: 0.08, blur: 3 }}
    classNames={{ content: styles.panel, body: styles.body }}
  >
    <div className={styles.top}>
      <FormModalHeader title={title ?? t('common.filters')} icon={<FunnelIcon />} onClose={onClose} />
      <div className={styles.fields}>{children}</div>
    </div>
    {footer}
  </Drawer>
  );
};
