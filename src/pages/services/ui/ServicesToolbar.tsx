import React from 'react';
import { Button, FileButton, Group, TextInput } from '@mantine/core';
import { DownloadSimpleIcon, MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { ArchiveToggle, listPageStyles } from '@/shared/ui';
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
}) => (
  <>
    <CategoriesPanel
      activeCategory={activeCategory}
      categories={categories}
      onCategoryChange={onCategoryChange}
      onAddCategory={onAddCategory}
    />

    <Group gap={8} wrap="nowrap">
      <TextInput
        placeholder="Поиск услуги"
        leftSection={<MagnifyingGlassIcon size={16} />}
        value={search}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        size="sm"
        className={listPageStyles.searchInput}
      />
      {!showArchived && (
        <>
          {canImport && (
            <FileButton
              onChange={onImportFile}
              accept=".xlsx,.xls"
              resetRef={resetImportRef}
            >
              {(props) => (
                <Button
                  {...props}
                  variant="light"
                  color="sage"
                  rightSection={<DownloadSimpleIcon size={16} />}
                  size="sm"
                  loading={importPending}
                >
                  Импорт Excel
                </Button>
              )}
            </FileButton>
          )}
          {canCreate && (
            <Button
              color="sage.6"
              rightSection={<PlusIcon size={16} />}
              onClick={onCreate}
              size="sm"
            >
              Добавить услугу
            </Button>
          )}
        </>
      )}
      <ArchiveToggle active={showArchived} onChange={onShowArchivedChange} />
    </Group>
  </>
);
