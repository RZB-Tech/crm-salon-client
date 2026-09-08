import React from 'react';
import { Alert, Box, Skeleton, Stack } from '@mantine/core';
import { ListCreateFab, ListPageShell, ListPaginationFooter } from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useI18n } from '@/shared/lib/i18n';
import type { BranchCredentials } from '@/shared/api/types';
import { useBranchesPage } from '../lib/useBranchesPage';
import { BranchAdminModal } from './BranchAdminModal';
import { BranchCreateModal } from './BranchCreateModal';
import { BranchCredentialsModal } from './BranchCredentialsModal';
import { BranchEditModal } from './BranchEditModal';
import { BranchesListBody } from './BranchesListBody';
import { BranchesReportTab } from './BranchesReportTab';
import { BranchesToolbar } from './BranchesToolbar';

export const BranchesPage: React.FC = () => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const [credentials, setCredentials] = React.useState<BranchCredentials | null>(null);
  const page = useBranchesPage();

  if (page.isLoading) {
    return (
      <ListPageShell
        toolbar={
          <>
            <Skeleton height={32} width={280} radius="md" />
            <Skeleton height={32} width={140} radius="md" />
          </>
        }
      >
        <Stack gap="xs" p="md">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} height={48} radius="sm" />
          ))}
        </Stack>
      </ListPageShell>
    );
  }

  if (page.isError) {
    return (
      <ListPageShell>
        <Box p="xl">
          <Alert color="red" title={t('branches.loadError')}>
            {t('common.checkApi')}
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  if (!page.isParent) {
    return (
      <ListPageShell>
        <Box p="xl">
          <Alert color="yellow" title={t('branches.notParent')}>
            {t('branches.notParentHint')}
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  const { paginatedItems, page: pageNum, pageSize, total, setPage, setPageSize } = page.pagination;
  const canCreate = page.tab === 'list' && hasPermission(PermissionCode.TENANT_BRANCH_CREATE);

  return (
    <ListPageShell
      toolbar={
        <BranchesToolbar
          tab={page.tab}
          search={page.search}
          filter={page.filter}
          onTabChange={(value) => page.setTab(value as 'list' | 'report')}
          onSearchChange={page.setSearch}
          onFilterChange={page.setFilter}
          onCreate={() => page.setCreateOpen(true)}
        />
      }
      footer={
        page.tab === 'list' ? (
          <ListPaginationFooter
            page={pageNum}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        ) : undefined
      }
      fab={
        isMobile && canCreate ? (
          <ListCreateFab label={t('branches.add')} onClick={() => page.setCreateOpen(true)} />
        ) : undefined
      }
    >
      {page.tab === 'list' ? (
        <BranchesListBody
          items={paginatedItems}
          sort={page.sort}
          onSort={page.toggleSort}
          onEdit={page.setEditing}
          onAddAdmin={page.setAdminTarget}
        />
      ) : (
        <BranchesReportTab />
      )}

      <BranchCreateModal
        opened={page.createOpen}
        onClose={() => page.setCreateOpen(false)}
        onCreated={setCredentials}
      />
      <BranchEditModal branch={page.editing} onClose={() => page.setEditing(null)} />
      <BranchAdminModal
        branch={page.adminTarget}
        onClose={() => page.setAdminTarget(null)}
        onCreated={setCredentials}
      />
      <BranchCredentialsModal credentials={credentials} onClose={() => setCredentials(null)} />
    </ListPageShell>
  );
};
