import React from 'react';
import { Box } from '@mantine/core';
import type { Staff } from '@/shared/api/types';
import { ListCards, ListPanelBody, ListPaginationFooter, listPageStyles } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { useTableSort } from '@/shared/lib/hooks/useTableSort';
import { useI18n } from '@/shared/lib/i18n';
import { StaffMobileCard } from './StaffMobileCard';
import { StaffTable } from './StaffTable';

interface StaffListBodyProps {
  staffList: Staff[];
  onSelectStaff: (staff: Staff) => void;
}

const STAFF_SORT_GETTERS = {
  login: (item: Staff) => item.login,
  name: (item: Staff) => [item.firstname, item.lastname].filter(Boolean).join(' '),
  status: (item: Staff) => Number(item.active),
};

export const StaffListBody: React.FC<StaffListBodyProps> = ({ staffList, onSelectStaff }) => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { sort, sortedItems, toggleSort } = useTableSort(staffList, STAFF_SORT_GETTERS, {
    key: 'login',
    dir: 'asc',
  });
  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } = usePagination(
    sortedItems,
    { defaultPageSize: 20 },
  );

  React.useEffect(() => {
    resetPage();
  }, [sort.key, sort.dir, resetPage]);

  return (
    <Box className={listPageStyles.panel}>
      <ListPanelBody>
        {isMobile ? (
          <ListCards isEmpty={paginatedItems.length === 0} emptyMessage={t('admin.emptyStaff')}>
            {paginatedItems.map((staff) => (
              <StaffMobileCard key={staff.id} staff={staff} onSelect={onSelectStaff} />
            ))}
          </ListCards>
        ) : (
          <StaffTable
            items={paginatedItems}
            sort={sort}
            onSort={toggleSort}
            onSelectStaff={onSelectStaff}
          />
        )}
      </ListPanelBody>
      <ListPaginationFooter
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </Box>
  );
};
