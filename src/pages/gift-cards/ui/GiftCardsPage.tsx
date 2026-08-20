import React from 'react';
import { Alert, Box, Skeleton, Stack } from '@mantine/core';
import { ConfirmModal, ListPageShell, ListPaginationFooter } from '@/shared/ui';
import { useCancelGiftCard } from '@/shared/api/hooks/useGiftCards';
import { useResetOnOpen } from '@/shared/lib/hooks/useResetOnOpen';
import { useGiftCardsPage } from '../lib/useGiftCardsPage';
import { GiftCardCancelModal } from './GiftCardCancelModal';
import { GiftCardFormModal } from './GiftCardFormModal';
import { GiftCardsTable } from './GiftCardsTable';
import { GiftCardsToolbar } from './GiftCardsToolbar';

export const GiftCardsPage: React.FC = () => {
  const [cancelReason, setCancelReason] = React.useState('');
  const cancelGiftCard = useCancelGiftCard();
  const {
    search,
    setSearch,
    filter,
    setFilter,
    showArchived,
    setShowArchived,
    formOpen,
    setFormOpen,
    editing,
    archiveTarget,
    setArchiveTargetId,
    cancelTarget,
    setCancelTargetId,
    isLoading,
    isError,
    pagination,
    sort,
    toggleSort,
    clientNameMap,
    openCreate,
    openEdit,
    restoreGiftCard,
    archiveGiftCard,
    confirmArchive,
  } = useGiftCardsPage();

  useResetOnOpen(cancelTarget, () => setCancelReason(''));

  if (isLoading) {
    return (
      <ListPageShell
        toolbar={
          <>
            <Skeleton height={32} width={360} radius="md" />
            <Skeleton height={32} width={160} radius="md" />
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

  if (isError) {
    return (
      <ListPageShell>
        <Box p="xl">
          <Alert color="red" title="Не удалось загрузить купоны">
            Проверьте доступность API
          </Alert>
        </Box>
      </ListPageShell>
    );
  }

  const { page, pageSize, paginatedItems, total, setPage, setPageSize } = pagination;

  return (
    <ListPageShell
      toolbar={
        <GiftCardsToolbar
          search={search}
          filter={filter}
          showArchived={showArchived}
          onSearchChange={setSearch}
          onFilterChange={setFilter}
          onShowArchivedChange={setShowArchived}
          onCreate={openCreate}
        />
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
      <GiftCardsTable
        items={paginatedItems}
        showArchived={showArchived}
        sort={sort}
        onSort={toggleSort}
        clientNameMap={clientNameMap}
        onEdit={openEdit}
        onArchive={(event, id) => {
          event.stopPropagation();
          setArchiveTargetId(id);
        }}
        onRestore={(event, id) => {
          event.stopPropagation();
          restoreGiftCard.mutate(id);
        }}
        onCancel={(event, id) => {
          event.stopPropagation();
          setCancelTargetId(id);
        }}
      />

      <GiftCardFormModal
        opened={formOpen}
        giftCard={editing}
        onClose={() => setFormOpen(false)}
      />
      <ConfirmModal
        opened={Boolean(archiveTarget)}
        title="Архивировать купон"
        message={`Архивировать «${archiveTarget?.code ?? ''}»? Купон будет скрыт из списка.`}
        loading={archiveGiftCard.isPending}
        onConfirm={confirmArchive}
        onClose={() => setArchiveTargetId(null)}
      />
      <GiftCardCancelModal
        opened={Boolean(cancelTarget)}
        code={cancelTarget?.code ?? ''}
        reason={cancelReason}
        loading={cancelGiftCard.isPending}
        onReasonChange={setCancelReason}
        onConfirm={() => {
          if (!cancelTarget || !cancelReason.trim()) return;
          cancelGiftCard.mutate(
            { id: cancelTarget.id, cancelled_reason: cancelReason.trim() },
            { onSuccess: () => setCancelTargetId(null) },
          );
        }}
        onClose={() => setCancelTargetId(null)}
      />
    </ListPageShell>
  );
};
