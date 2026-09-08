import React from 'react';
import { Button, Group, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { ArchiveToggle, ListPageTitle, ListTabs, listPageStyles } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
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
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const canCreate = !showArchived && hasPermission(PermissionCode.GIFT_CARD_CREATE);

  const searchInput = (
    <TextInput
      placeholder={t('giftCards.searchPlaceholder')}
      leftSection={<MagnifyingGlassIcon size={16} />}
      value={search}
      onChange={(event) => onSearchChange(event.currentTarget.value)}
      size="sm"
      className={listPageStyles.searchInput}
    />
  );

  const statusTabs = (
    <ListTabs
      value={filter}
      onChange={(value) => onFilterChange(value as GiftCardsFilter)}
      data={[
        { value: 'all', label: t('common.all') },
        { value: 'active', label: t('common.active') },
        { value: 'used', label: t('giftCards.used') },
        { value: 'expired', label: t('giftCards.expired') },
        { value: 'cancelled', label: t('giftCards.cancelled') },
      ]}
    />
  );

  if (isMobile) {
    return (
      <>
        <ListPageTitle onBack={showArchived ? () => onShowArchivedChange(false) : undefined}>
          {showArchived ? t('appointments.archiveTab') : t('giftCards.title')}
        </ListPageTitle>
        <div className={listPageStyles.toolbarRow}>
          {searchInput}
          <ArchiveToggle
            className={listPageStyles.archiveBtn}
            active={showArchived}
            onChange={onShowArchivedChange}
          />
        </div>
        {statusTabs}
      </>
    );
  }

  return (
    <>
      <Group gap={8} wrap="nowrap">
        {statusTabs}
        {searchInput}
      </Group>
      <Group gap={8} wrap="nowrap">
        {canCreate && (
          <Button color="sage.7" rightSection={<PlusIcon size={16} />} onClick={onCreate} size="sm">
            {t('giftCards.newCard')}
          </Button>
        )}
        <ArchiveToggle active={showArchived} onChange={onShowArchivedChange} />
      </Group>
    </>
  );
};
