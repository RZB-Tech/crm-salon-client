import React from 'react';
import { Button, Group, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { ListTabs, listPageStyles } from '@/shared/ui';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import type { PromotionsFilter } from '../lib/usePromotionsPage';

interface PromotionsToolbarProps {
  search: string;
  filter: PromotionsFilter;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: PromotionsFilter) => void;
  onCreate: () => void;
}

export const PromotionsToolbar: React.FC<PromotionsToolbarProps> = ({
  search,
  filter,
  onSearchChange,
  onFilterChange,
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
            { value: 'archive', label: 'Архив' },
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
      {filter !== 'archive' && hasPermission(PermissionCode.PROMOTION_CREATE) && (
        <Button
          color="sage.7"
          rightSection={<PlusIcon size={16} />}
          onClick={onCreate}
          size="sm"
        >
          Добавить акцию
        </Button>
      )}
    </>
  );
};
