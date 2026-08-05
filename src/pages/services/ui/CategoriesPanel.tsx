import React from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import type { ServiceCategory } from '@/shared/api/types';
import { ListTabs } from '@/shared/ui';

interface CategoriesPanelProps {
  activeCategory: string;
  categories: ServiceCategory[];
  onCategoryChange: (value: string) => void;
  onAddCategory: () => void;
}

export const CategoriesPanel: React.FC<CategoriesPanelProps> = ({
  activeCategory,
  categories,
  onCategoryChange,
  onAddCategory,
}) => {
  const segmentData = React.useMemo(() => {
    const items = [{ value: 'all', label: 'Все' }];
    for (const c of categories) {
      items.push({ value: String(c.id), label: c.name });
    }
    return items;
  }, [categories]);

  return (
    <ListTabs
      value={activeCategory}
      onChange={onCategoryChange}
      data={segmentData}
      action={
        <Tooltip label="Добавить категорию" position="bottom">
          <ActionIcon
            size="sm"
            variant="subtle"
            color="sage"
            onClick={onAddCategory}
            aria-label="Добавить категорию"
          >
            <PlusIcon size={16} />
          </ActionIcon>
        </Tooltip>
      }
    />
  );
};
