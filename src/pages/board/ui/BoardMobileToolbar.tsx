import React from 'react';
import { ActionIcon, Text, TextInput, UnstyledButton } from '@mantine/core';
import {
  ArchiveIcon,
  CalendarBlankIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CurrencyCircleDollarIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react';
import type { Employee } from '@/shared/api/types';
import { useI18n } from '@/shared/lib/i18n';
import { formatBoardDateChip } from '../lib/boardMobileLayout';
import { EmployeeFilterPopover } from './EmployeeFilterPopover';
import styles from './board-mobile-toolbar.module.css';

interface BoardMobileToolbarProps {
  date: Date;
  showArchived: boolean;
  searchOpen: boolean;
  searchQuery: string;
  boardEmployees: Employee[];
  employeeFilter: Set<number>;
  onEmployeeFilterChange: (ids: Set<number>) => void;
  onOpenDateSheet: () => void;
  onOpenRevenueSheet: () => void;
  onShowArchivedChange: (value: boolean) => void;
  onSearchOpenChange: (open: boolean) => void;
  onSearchQueryChange: (value: string) => void;
}

export const BoardMobileToolbar: React.FC<BoardMobileToolbarProps> = ({
  date,
  showArchived,
  searchOpen,
  searchQuery,
  boardEmployees,
  employeeFilter,
  onEmployeeFilterChange,
  onOpenDateSheet,
  onOpenRevenueSheet,
  onShowArchivedChange,
  onSearchOpenChange,
  onSearchQueryChange,
}) => {
  const { t } = useI18n();
  const dateLabel = React.useMemo(() => formatBoardDateChip(date), [date]);

  const handleCloseSearch = React.useCallback(() => {
    onSearchOpenChange(false);
    onSearchQueryChange('');
  }, [onSearchOpenChange, onSearchQueryChange]);

  const handleLeaveArchive = React.useCallback(() => {
    onShowArchivedChange(false);
  }, [onShowArchivedChange]);

  return (
    <div className={styles.toolbar}>
      <div className={styles.heading}>
        {showArchived && !searchOpen && (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={handleLeaveArchive}
            aria-label={t('board.previous')}
          >
            <CaretLeftIcon size={16} />
          </ActionIcon>
        )}
        <Text className={styles.title}>
          {showArchived && !searchOpen ? t('board.archiveView') : t('board.title')}
        </Text>
      </div>

      {searchOpen ? (
        <div className={styles.actions}>
          <TextInput
            className={styles.searchInput}
            placeholder={t('common.search')}
            leftSection={<MagnifyingGlassIcon size={20} />}
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.currentTarget.value)}
            autoFocus
            size="sm"
          />
          <ActionIcon
            variant="default"
            color="gray"
            size={40}
            onClick={handleCloseSearch}
            aria-label={t('common.close')}
          >
            <XIcon size={20} />
          </ActionIcon>
        </div>
      ) : (
        <div className={styles.actions}>
          <UnstyledButton className={styles.dateChip} onClick={onOpenDateSheet}>
            <span className={styles.dateChipLabel}>
              <CalendarBlankIcon size={16} />
              <Text size="sm" truncate>
                {dateLabel}
              </Text>
            </span>
            <CaretDownIcon size={16} />
          </UnstyledButton>
          {!showArchived && (
            <ActionIcon
              variant="default"
              color="gray"
              size={40}
              onClick={onOpenRevenueSheet}
              aria-label={t('board.dayRevenue')}
            >
              <CurrencyCircleDollarIcon size={20} />
            </ActionIcon>
          )}
          {!showArchived && boardEmployees.length > 0 && (
            <EmployeeFilterPopover
              employees={boardEmployees}
              selectedIds={employeeFilter}
              onChange={onEmployeeFilterChange}
              iconOnly
            />
          )}
          <ActionIcon
            variant="default"
            color="gray"
            size={40}
            onClick={() => onSearchOpenChange(true)}
            aria-label={t('common.search')}
          >
            <MagnifyingGlassIcon size={20} />
          </ActionIcon>
          <ActionIcon
            variant={showArchived ? 'light' : 'default'}
            color={showArchived ? 'sage' : 'gray'}
            size={40}
            className={showArchived ? styles.archiveActive : undefined}
            onClick={() => onShowArchivedChange(!showArchived)}
            aria-label={showArchived ? t('common.showActive') : t('common.showArchive')}
            aria-pressed={showArchived}
          >
            <ArchiveIcon size={20} />
          </ActionIcon>
        </div>
      )}
    </div>
  );
};
