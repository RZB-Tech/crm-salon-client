import React from 'react';
import { Button, Group, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { ArchiveToggle, ListTabs, listPageStyles } from '@/shared/ui';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import type { GiftCardsFilter } from '../lib/useGiftCardsPage';

interface GiftCardsToolbarProps {
  search: string;
  filter: GiftCardsFilter;
  showArchived: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: GiftCardsFilter) => void;
  onShowArchivedChange: (value: boolean) => void;
  onCreate: () => void;
}

export const GiftCardsToolbar: React.FC<GiftCardsToolbarProps> = ({
  search,
  filter,
  showArchived,
  onSearchChange,
  onFilterChange,
  onShowArchivedChange,
  onCreate,
}) => {
  const { hasPermission } = useAccess();

  return (
    <>
      <Group gap={8} wrap="nowrap">
        <ListTabs
          value={filter}
          onChange={(value) => onFilterChange(value as GiftCardsFilter)}
          data={[
            { value: 'all', label: 'Все' },
            { value: 'active', label: 'Активные' },
            { value: 'used', label: 'Использованные' },
            { value: 'expired', label: 'Истёкшие' },
            { value: 'cancelled', label: 'Отменённые' },
          ]}
        />
        <TextInput
          placeholder="Поиск по коду или клиенту..."
          leftSection={<MagnifyingGlassIcon size={16} />}
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          size="sm"
          className={listPageStyles.searchInput}
        />
      </Group>
      <Group gap={8} wrap="nowrap">
        {!showArchived && hasPermission(PermissionCode.GIFT_CARD_CREATE) && (
          <Button
            color="sage.7"
            rightSection={<PlusIcon size={16} />}
            onClick={onCreate}
            size="sm"
          >
            Новый купон
          </Button>
        )}
        <ArchiveToggle active={showArchived} onChange={onShowArchivedChange} />
      </Group>
    </>
  );
};
