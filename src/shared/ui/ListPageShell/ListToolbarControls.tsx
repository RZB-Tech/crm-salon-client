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

type ListTabsProps = SegmentedControlProps & {
  /** Контрол внутри трека табов (например, «добавить категорию»). */
  action?: React.ReactNode;
};

const TABS_TRACK_BG = '#F9F6F3';

/** Табы — SegmentedControl; из кастома только фон макета и слот для плюса в треке. */
export const ListTabs: React.FC<ListTabsProps> = ({ action, ...props }) => {
  if (!action) {
    return (
      <SegmentedControl {...props} styles={{ root: { background: TABS_TRACK_BG } }} />
    );
  }

  return (
    <Group gap={4} p={4} wrap="nowrap" bg={TABS_TRACK_BG} style={{ borderRadius: 'var(--mantine-radius-xs)' }}>
      <SegmentedControl
        {...props}
        styles={{ root: { background: 'transparent', padding: 0 } }}
      />
      {action}
    </Group>
  );
};

interface ArchiveToggleProps {
  active: boolean;
  onChange: (active: boolean) => void;
}

/** Архив — ActionIcon size="input-sm" (= высота Input/Button sm). */
export const ArchiveToggle: React.FC<ArchiveToggleProps> = ({ active, onChange }) => (
  <Tooltip label={active ? 'Показать активные' : 'Показать архив'} position="bottom">
    <ActionIcon
      size="input-sm"
      variant={active ? 'light' : 'default'}
      color={active ? 'orange' : 'gray'}
      onClick={() => onChange(!active)}
      aria-label={active ? 'Показать активные' : 'Показать архив'}
      aria-pressed={active}
    >
      <ArchiveIcon size={18} />
    </ActionIcon>
  </Tooltip>
);

export type ListViewMode = 'cards' | 'table';

const VIEW_OPTIONS: {
  value: ListViewMode;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: 'cards', label: 'Карточки', icon: <SquaresFourIcon size={18} /> },
  { value: 'table', label: 'Таблица', icon: <TableIcon size={18} /> },
];

interface ViewModeToggleProps {
  value: ListViewMode;
  onChange: (value: ListViewMode) => void;
}

/** Вид — ActionIcon size="input-sm", меню выбора. */
export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ value, onChange }) => {
  const current = VIEW_OPTIONS.find((o) => o.value === value) ?? VIEW_OPTIONS[0];

  return (
    <Menu shadow="sm" width={180} position="bottom-end" radius="md">
      <Tooltip label={`Вид: ${current.label}`} position="bottom">
        <Menu.Target>
          <ActionIcon
            size="input-sm"
            variant="default"
            color="gray"
            aria-label={`Вид: ${current.label}`}
          >
            {current.icon}
          </ActionIcon>
        </Menu.Target>
      </Tooltip>
      <Menu.Dropdown>
        <Menu.Label>Вид списка</Menu.Label>
        {VIEW_OPTIONS.map((option) => (
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
