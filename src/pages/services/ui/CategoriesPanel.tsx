import React from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { PlusIcon } from '@phosphor-icons/react';
import type { ServiceCategory } from '@/shared/api/types';
import { ListTabs } from '@/shared/ui';
import { useI18n } from '@/shared/lib/i18n';
import styles from './categories-panel.module.css';

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
  const { t } = useI18n();
  const segmentData = React.useMemo(() => {
    const items = [{ value: 'all', label: t('common.all') }];
    for (const c of categories) {
      items.push({ value: String(c.id), label: c.name });
    }
    return items;
  }, [categories, t]);

  return (
    <div className={styles.scroll}>
      <ListTabs
        value={activeCategory}
        onChange={onCategoryChange}
        data={segmentData}
        action={
          <Tooltip label={t('services.addCategory')} position="bottom">
            <ActionIcon
              size="sm"
              variant="subtle"
              color="sage"
              onClick={onAddCategory}
              aria-label={t('services.addCategory')}
            >
              <PlusIcon size={16} />
            </ActionIcon>
          </Tooltip>
        }
      />
    </div>
  );
};
