import React from 'react';
import { Button, Group, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { ArchiveToggle, ListPageTitle, ListTabs, listPageStyles } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import type { PromotionsFilter, PromotionsKindFilter } from '../lib/usePromotionsPage';

interface PromotionsToolbarProps {
  search: string;
  filter: PromotionsFilter;
  kindFilter: PromotionsKindFilter;
  showArchived: boolean;
  canCreate: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: PromotionsFilter) => void;
  onKindFilterChange: (value: PromotionsKindFilter) => void;
  onShowArchivedChange: (value: boolean) => void;
  onCreate: () => void;
}

export const PromotionsToolbar: React.FC<PromotionsToolbarProps> = ({
  search,
  filter,
  kindFilter,
  showArchived,
  canCreate,
  onSearchChange,
  onFilterChange,
  onKindFilterChange,
  onShowArchivedChange,
  onCreate,
}) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  const searchInput = (
    <TextInput
      placeholder={t('promotions.searchPlaceholder')}
      leftSection={<MagnifyingGlassIcon size={16} />}
      value={search}
      onChange={(event) => onSearchChange(event.currentTarget.value)}
      size="sm"
      className={listPageStyles.searchInput}
    />
  );

  if (isMobile) {
    return (
      <>
        <ListPageTitle onBack={showArchived ? () => onShowArchivedChange(false) : undefined}>
          {showArchived ? t('appointments.archiveTab') : t('promotions.title')}
        </ListPageTitle>
        <div className={listPageStyles.toolbarRow}>
          {searchInput}
          <ArchiveToggle
            className={listPageStyles.archiveBtn}
            active={showArchived}
            onChange={onShowArchivedChange}
          />
        </div>
        <ListTabs
          value={kindFilter}
          onChange={(value) => onKindFilterChange(value as PromotionsKindFilter)}
          data={[
            { value: 'all', label: t('common.all') },
            { value: 'service', label: t('promotions.services') },
            { value: 'material', label: t('promotions.products') },
          ]}
        />
      </>
    );
  }

  return (
    <>
      <Group gap={8} wrap="nowrap">
        <ListTabs
          value={filter}
          onChange={(value) => onFilterChange(value as PromotionsFilter)}
          data={[
            { value: 'all', label: t('common.all') },
            { value: 'active', label: t('common.active') },
          ]}
        />
        {searchInput}
      </Group>
      <Group gap={8} wrap="nowrap">
        {!showArchived && canCreate && (
          <Button
            color="sage.7"
            rightSection={<PlusIcon size={16} />}
            onClick={onCreate}
            size="sm"
          >
            {t('form.addPromo')}
          </Button>
        )}
        <ArchiveToggle active={showArchived} onChange={onShowArchivedChange} />
      </Group>
    </>
  );
};
