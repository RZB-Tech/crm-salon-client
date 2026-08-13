import React from 'react';
import { Button, Group, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { ArchiveToggle, ListTabs, listPageStyles } from '@/shared/ui';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import type { PromotionsFilter } from '../lib/usePromotionsPage';

interface PromotionsToolbarProps {
  search: string;
  filter: PromotionsFilter;
  showArchived: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: PromotionsFilter) => void;
  onShowArchivedChange: (value: boolean) => void;
  onCreate: () => void;
}

export const PromotionsToolbar: React.FC<PromotionsToolbarProps> = ({
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
          onChange={(value) => onFilterChange(value as PromotionsFilter)}
          data={[
            { value: 'all', label: 'Все' },
            { value: 'active', label: 'Активные' },
          ]}
        />
        <TextInput
          placeholder="Поиск по названию..."
          leftSection={<MagnifyingGlassIcon size={16} />}
          value={search}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          size="sm"
          className={listPageStyles.searchInput}
        />
      </Group>
      <Group gap={8} wrap="nowrap">
        {!showArchived && hasPermission(PermissionCode.PROMOTION_CREATE) && (
          <Button
            color="sage.7"
            rightSection={<PlusIcon size={16} />}
            onClick={onCreate}
            size="sm"
          >
            Добавить акцию
          </Button>
        )}
        <ArchiveToggle active={showArchived} onChange={onShowArchivedChange} />
      </Group>
    </>
  );
};
