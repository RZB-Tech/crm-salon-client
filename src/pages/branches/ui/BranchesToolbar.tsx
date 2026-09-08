import React from 'react';
import { Button, Group, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { ListPageTitle, ListTabs, listPageStyles } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import type { BranchFilter } from '../lib/branchForm';

interface BranchesToolbarProps {
  tab: string;
  search: string;
  filter: BranchFilter;
  onTabChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: BranchFilter) => void;
  onCreate: () => void;
}

export const BranchesToolbar: React.FC<BranchesToolbarProps> = ({
  tab,
  search,
  filter,
  onTabChange,
  onSearchChange,
  onFilterChange,
  onCreate,
}) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const canCreate = hasPermission(PermissionCode.TENANT_BRANCH_CREATE);

  const mainTabs = (
    <ListTabs
      value={tab}
      onChange={onTabChange}
      data={[
        { value: 'list', label: t('branches.title') },
        { value: 'report', label: t('branches.report') },
      ]}
    />
  );

  if (isMobile) {
    return (
      <>
        <ListPageTitle>{t('nav.branches')}</ListPageTitle>
        {mainTabs}
        {tab === 'list' && (
          <>
            <ListTabs
              value={filter}
              onChange={(value) => onFilterChange(value as BranchFilter)}
              data={[
                { value: 'all', label: t('common.all') },
                { value: 'active', label: t('common.active') },
                { value: 'inactive', label: t('common.inactive') },
              ]}
            />
            <div className={listPageStyles.toolbarRow}>
              <TextInput
                placeholder={t('branches.searchPlaceholder')}
                leftSection={<MagnifyingGlassIcon size={16} />}
                value={search}
                onChange={(event) => onSearchChange(event.currentTarget.value)}
                size="sm"
                className={listPageStyles.searchInput}
              />
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <Group gap={8} wrap="nowrap">
        {mainTabs}
        {tab === 'list' && (
          <>
            <ListTabs
              value={filter}
              onChange={(value) => onFilterChange(value as BranchFilter)}
              data={[
                { value: 'all', label: t('common.all') },
                { value: 'active', label: t('common.active') },
                { value: 'inactive', label: t('common.inactive') },
              ]}
            />
            <TextInput
              placeholder={t('branches.searchPlaceholder')}
              leftSection={<MagnifyingGlassIcon size={16} />}
              value={search}
              onChange={(event) => onSearchChange(event.currentTarget.value)}
              size="sm"
              className={listPageStyles.searchInput}
            />
          </>
        )}
      </Group>
      {tab === 'list' && canCreate && (
        <Button color="sage.7" rightSection={<PlusIcon size={16} />} onClick={onCreate} size="sm">
          {t('branches.add')}
        </Button>
      )}
    </>
  );
};
