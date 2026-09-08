import React from 'react';
import {
  ActionIcon,
  Group,
  Menu,
  SegmentedControl,
  Tooltip,
  type SegmentedControlProps,
} from '@mantine/core';
import {
  ArchiveIcon,
  CheckIcon,
  SquaresFourIcon,
  TableIcon,
} from '@phosphor-icons/react';
import { useI18n } from '@/shared/lib/i18n';
import styles from './list-page-shell.module.css';

type ListTabsProps = SegmentedControlProps & {
  /** Контрол внутри трека табов (например, «добавить категорию»). */
  action?: React.ReactNode;
};

const TABS_TRACK_BG = '#F9F6F3';

/** Табы — SegmentedControl; из кастома только фон макета и слот для плюса в треке. */
export const ListTabs: React.FC<ListTabsProps> = ({ action, ...props }) => {
  if (!action) {
    return (
      <div className={styles.tabsScroll}>
        <SegmentedControl {...props} styles={{ root: { background: TABS_TRACK_BG } }} />
      </div>
    );
  }

  return (
    <div className={styles.tabsScroll}>
      <Group gap={4} p={4} wrap="nowrap" bg={TABS_TRACK_BG} style={{ borderRadius: 'var(--mantine-radius-xs)' }}>
        <SegmentedControl
          {...props}
          styles={{ root: { background: 'transparent', padding: 0 } }}
        />
        {action}
      </Group>
    </div>
  );
};

interface ArchiveToggleProps {
  active: boolean;
  onChange: (active: boolean) => void;
  className?: string;
}

/** Архив — ActionIcon size="input-sm" (= высота Input/Button sm). */
export const ArchiveToggle: React.FC<ArchiveToggleProps> = ({ active, onChange, className }) => {
  const { t } = useI18n();
  const label = active ? t('common.showActive') : t('common.showArchive');
  return (
  <Tooltip label={label} position="bottom">
    <ActionIcon
      className={className}
      size="input-sm"
      variant={active ? 'light' : 'default'}
      color={active ? 'orange' : 'gray'}
      onClick={() => onChange(!active)}
      aria-label={label}
      aria-pressed={active}
    >
      <ArchiveIcon size={18} />
    </ActionIcon>
  </Tooltip>
  );
};

export type ListViewMode = 'cards' | 'table';

interface ViewModeToggleProps {
  value: ListViewMode;
  onChange: (value: ListViewMode) => void;
}

/** Вид — ActionIcon size="input-sm", меню выбора. */
export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ value, onChange }) => {
  const { t } = useI18n();
  const viewOptions: {
    value: ListViewMode;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: 'cards', label: t('common.cards'), icon: <SquaresFourIcon size={18} /> },
    { value: 'table', label: t('common.table'), icon: <TableIcon size={18} /> },
  ];
  const current = viewOptions.find((o) => o.value === value) ?? viewOptions[0];
  const named = t('common.viewNamed', { label: current.label });

  return (
    <Menu shadow="sm" width={180} position="bottom-end" radius="md">
      <Tooltip label={named} position="bottom">
        <Menu.Target>
          <ActionIcon
            size="input-sm"
            variant="default"
            color="gray"
            aria-label={named}
          >
            {current.icon}
          </ActionIcon>
        </Menu.Target>
      </Tooltip>
      <Menu.Dropdown>
        <Menu.Label>{t('common.viewList')}</Menu.Label>
        {viewOptions.map((option) => (
          <Menu.Item
            key={option.value}
            leftSection={option.icon}
            rightSection={value === option.value ? <CheckIcon size={14} /> : null}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
