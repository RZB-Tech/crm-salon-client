import React from 'react';
import { ActionIcon, Button, FileButton, Group, TextInput } from '@mantine/core';
import { DownloadSimpleIcon, MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { ArchiveToggle, ListPageTitle, listPageStyles } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { useI18n } from '@/shared/lib/i18n';
import type { ServiceCategory } from '@/shared/api/types';
import { CategoriesPanel } from './CategoriesPanel';

interface ServicesToolbarProps {
  activeCategory: string;
  categories: ServiceCategory[];
  search: string;
  showArchived: boolean;
  canImport: boolean;
  canCreate: boolean;
  importPending: boolean;
  resetImportRef: React.RefObject<(() => void) | null>;
  onCategoryChange: (value: string) => void;
  onAddCategory: () => void;
  onSearchChange: (value: string) => void;
  onImportFile: (file: File | null) => void;
  onCreate: () => void;
  onShowArchivedChange: (value: boolean) => void;
}

export const ServicesToolbar: React.FC<ServicesToolbarProps> = ({
  activeCategory,
  categories,
  search,
  showArchived,
  canImport,
  canCreate,
  importPending,
  resetImportRef,
  onCategoryChange,
  onAddCategory,
  onSearchChange,
  onImportFile,
  onCreate,
  onShowArchivedChange,
}) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();

  const importControl = canImport && !showArchived && (
    <FileButton onChange={onImportFile} accept=".xlsx,.xls" resetRef={resetImportRef}>
      {(props) =>
        isMobile ? (
          <ActionIcon
            {...props}
            className={listPageStyles.archiveBtn}
            variant="default"
            size={40}
            radius={8}
            loading={importPending}
            aria-label={t('services.importExcel')}
          >
            <DownloadSimpleIcon size={18} />
          </ActionIcon>
        ) : (
          <Button
            {...props}
            variant="light"
            color="sage"
            rightSection={<DownloadSimpleIcon size={16} />}
            size="sm"
            loading={importPending}
          >
            {t('services.importExcel')}
          </Button>
        )
      }
    </FileButton>
  );

  const searchInput = (
    <TextInput
      placeholder={t('services.searchPlaceholder')}
      leftSection={<MagnifyingGlassIcon size={16} />}
      value={search}
      onChange={(e) => onSearchChange(e.currentTarget.value)}
      size="sm"
      className={listPageStyles.searchInput}
    />
  );

  const categoriesPanel = (
    <CategoriesPanel
      activeCategory={activeCategory}
      categories={categories}
      onCategoryChange={onCategoryChange}
      onAddCategory={onAddCategory}
    />
  );

  if (isMobile) {
    return (
      <>
        <ListPageTitle onBack={showArchived ? () => onShowArchivedChange(false) : undefined}>
          {showArchived ? t('appointments.archiveTab') : t('services.title')}
        </ListPageTitle>
        <div className={listPageStyles.toolbarRow}>
          {searchInput}
          <Group gap={8} wrap="nowrap">
            {importControl}
            <ArchiveToggle
              className={listPageStyles.archiveBtn}
              active={showArchived}
              onChange={onShowArchivedChange}
            />
          </Group>
        </div>
        {categoriesPanel}
      </>
    );
  }

  return (
    <>
      {categoriesPanel}
      <Group gap={8} wrap="nowrap">
        {searchInput}
        {importControl}
        {canCreate && !showArchived && (
          <Button
            color="sage.6"
            rightSection={<PlusIcon size={16} />}
            onClick={onCreate}
            size="sm"
          >
            {t('services.add')}
          </Button>
        )}
        <ArchiveToggle active={showArchived} onChange={onShowArchivedChange} />
      </Group>
    </>
  );
};
