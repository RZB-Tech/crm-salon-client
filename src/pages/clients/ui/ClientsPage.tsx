import React from 'react';
import { Alert, Box, Button, Group, Skeleton, Stack, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import {
  ArchiveToggle,
  ConfirmModal,
  ListCreateFab,
  ListPageShell,
  ListPageTitle,
  ListPaginationFooter,
  listPageStyles,
} from '@/shared/ui';
import { useIsMobile } from '@/shared/lib/hooks/useIsMobile';
import { getClientFullName } from '@/shared/lib/format';
import { useI18n } from '@/shared/lib/i18n';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useClientsPage } from '../lib/useClientsPage';
import { ClientFormModal } from './ClientFormModal';
import { DepositModal } from './DepositModal';
import { ClientDetailModal } from './ClientDetailModal';
import { ClientsListBody } from './ClientsListBody';

export const ClientsPage: React.FC = () => {
  const { t } = useI18n();
  const isMobile = useIsMobile();
  const { hasPermission } = useAccess();
  const {
    search,
    setSearch,
    showArchived,
    setShowArchived,
    formOpen,
    setFormOpen,
    liveEditing,
    liveDepositTarget,
    setDepositTarget,
    liveDetailTarget,
    archiveTarget,
    setArchiveTargetId,
    isLoading,
    isError,
    pagination,
    sort,
    toggleSort,
    openCreate,
    handleEditFromDetail,
    handleDepositFromDetail,
    setDetailTarget,
    restoreClient,
    archiveClient,
    confirmArchive,
  } = useClientsPage();

  if (isLoading) {
    return (
      <ListPageShell
        toolbar={
          <>
            <Skeleton height={32} width={240} radius="md" />
            <Skeleton height={32} width={160} radius="md" />
          </>
        }
      >
        <Stack gap="xs" p="md">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={48} radius="sm" />
          ))}
        </Stack>
      </ListPageShell>
    );
  }

  if (isError) {
    return (
      <ListPageShell>
        <Box p="xl">
          <Alert color="red" title={t('clients.loadError')}>
            {t('common.checkApiAuth')}
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  const { page, pageSize, paginatedItems, total, setPage, setPageSize } = pagination;

  return (
    <ListPageShell
      toolbar={
        <>
          {isMobile && (
            <ListPageTitle onBack={showArchived ? () => setShowArchived(false) : undefined}>
              {showArchived ? t('clients.archiveTab') : t('clients.title')}
            </ListPageTitle>
          )}
          <div className={isMobile ? listPageStyles.toolbarRow : undefined}>
            <TextInput
              placeholder={t('clients.searchPlaceholder')}
              leftSection={<MagnifyingGlassIcon size={16} />}
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              size="sm"
              className={listPageStyles.searchInput}
            />
            <Group gap={8} wrap="nowrap">
              {!isMobile && !showArchived && hasPermission(PermissionCode.CLIENT_CREATE) && (
                <Button
                  color="sage.7"
                  rightSection={<PlusIcon size={16} />}
                  onClick={openCreate}
                  size="sm"
                >
                  {t('clients.add')}
                </Button>
              )}
              <ArchiveToggle
                className={isMobile ? listPageStyles.archiveBtn : undefined}
                active={showArchived}
                onChange={setShowArchived}
              />
            </Group>
          </div>
        </>
      }
      footer={
        <ListPaginationFooter
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      }
      fab={
        isMobile && !showArchived && hasPermission(PermissionCode.CLIENT_CREATE) ? (
          <ListCreateFab label={t('clients.add')} onClick={openCreate} />
        ) : undefined
      }
    >
      <ClientsListBody
        items={paginatedItems}
        showArchived={showArchived}
        sort={sort}
        onSort={toggleSort}
        onRowClick={setDetailTarget}
        onArchive={(e, id) => {
          e.stopPropagation();
          setArchiveTargetId(id);
        }}
        onRestore={(e, id) => {
          e.stopPropagation();
          restoreClient.mutate(id);
        }}
      />

      <ClientFormModal opened={formOpen} client={liveEditing} onClose={() => setFormOpen(false)} />
      <DepositModal client={liveDepositTarget} onClose={() => setDepositTarget(null)} />
      <ClientDetailModal
        client={liveDetailTarget}
        onClose={() => setDetailTarget(null)}
        onEdit={handleEditFromDetail}
        onDeposit={handleDepositFromDetail}
      />
      <ConfirmModal
        opened={Boolean(archiveTarget)}
        title={t('clients.archiveTitle')}
        message={t('clients.archiveMessage', {
          name: archiveTarget ? getClientFullName(archiveTarget) : '',
        })}
        loading={archiveClient.isPending}
        onConfirm={confirmArchive}
        onClose={() => setArchiveTargetId(null)}
      />
    </ListPageShell>
  );
};
