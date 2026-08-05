import React from 'react';
import { Alert, Box, Button, Group, Skeleton, Stack, TextInput } from '@mantine/core';
import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import {
  ArchiveToggle,
  ConfirmModal,
  ListPageShell,
  ListPaginationFooter,
  listPageStyles,
} from '@/shared/ui';
import { getClientFullName } from '@/shared/lib/format';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { useClientsPage } from '../lib/useClientsPage';
import { ClientFormModal } from './ClientFormModal';
import { DepositModal } from './DepositModal';
import { ClientDetailModal } from './ClientDetailModal';
import { ClientsTable } from './ClientsTable';

export const ClientsPage: React.FC = () => {
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
          <Alert color="red" title="Не удалось загрузить клиентов">
            Проверьте доступность API и авторизацию
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
          <TextInput
            placeholder="Поиск по имени, телефону..."
            leftSection={<MagnifyingGlassIcon size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            size="sm"
            className={listPageStyles.searchInput}
          />
          <Group gap={8} wrap="nowrap">
            {!showArchived && hasPermission(PermissionCode.CLIENT_CREATE) && (
              <Button
                color="sage.7"
                rightSection={<PlusIcon size={16} />}
                onClick={openCreate}
                size="sm"
              >
                Добавить клиента
              </Button>
            )}
            <ArchiveToggle active={showArchived} onChange={setShowArchived} />
          </Group>
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
    >
      <ClientsTable
        items={paginatedItems}
        showArchived={showArchived}
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
        title="Архивировать клиента"
        message={`Архивировать ${archiveTarget ? getClientFullName(archiveTarget) : ''}? Клиент будет скрыт из списка.`}
        loading={archiveClient.isPending}
        onConfirm={confirmArchive}
        onClose={() => setArchiveTargetId(null)}
      />
    </ListPageShell>
  );
};
