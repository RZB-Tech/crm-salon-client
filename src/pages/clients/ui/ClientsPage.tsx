import React from 'react';
import {
  ActionIcon,
  Alert,
  Avatar,
  Box,
  Button,
  Group,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import { useClients, useArchiveClient, useRestoreClient } from '@/shared/api/hooks/useClients';
import type { Client } from '@/shared/api/types';
import {
  ArchiveToggle,
  ConfirmModal,
  ListPageShell,
  ListPaginationFooter,
  listPageStyles,
} from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import {
  formatDate,
  formatPrice,
  getClientFullName,
  getClientInitials,
  SEX_LABELS,
} from '@/shared/lib/format';
import { ClientFormModal } from './ClientFormModal';
import { DepositModal } from './DepositModal';
import { PermissionCode, useAccess } from '@/shared/lib/permissions';
import { ClientDetailModal } from './ClientDetailModal';
import { useResolvedById } from '@/shared/lib/hooks/useResolvedById';

export const ClientsPage: React.FC = () => {
  const { hasPermission } = useAccess();
  const [search, setSearch] = React.useState('');
  const [showArchived, setShowArchived] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Client | null>(null);
  const [depositTarget, setDepositTarget] = React.useState<Client | null>(null);
  const [archiveTargetId, setArchiveTargetId] = React.useState<number | null>(null);
  const [detailTarget, setDetailTarget] = React.useState<Client | null>(null);

  const { data: clients, isLoading, isError } = useClients(showArchived);
  const archiveClient = useArchiveClient();
  const restoreClient = useRestoreClient();

  /** Актуальная копия клиента из кэша списка — модалки не залипают на старом snapshot */
  const resolveClient = React.useCallback(
    (target: Client | null) => {
      if (!target) return null;
      return (clients ?? []).find((client) => client.id === target.id) ?? target;
    },
    [clients],
  );
  const liveEditing = resolveClient(editing);
  const liveDepositTarget = resolveClient(depositTarget);
  const liveDetailTarget = resolveClient(detailTarget);
  const archiveTarget = useResolvedById(clients, archiveTargetId);

  const filtered = React.useMemo(
    () =>
      (clients ?? []).filter((client) => {
        const name = getClientFullName(client).toLowerCase();
        const q = search.toLowerCase();
        return !q || name.includes(q) || (client.phone ?? '').includes(q);
      }),
    [clients, search],
  );

  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } =
    usePagination(filtered, { defaultPageSize: 20 });

  React.useEffect(() => {
    resetPage();
  }, [search, resetPage]);

  const openCreate = React.useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((c: Client) => {
    setEditing(c);
    setFormOpen(true);
  }, []);

  const handleEditFromDetail = React.useCallback((c: Client) => {
    setDetailTarget(null);
    openEdit(c);
  }, [openEdit]);

  const handleDepositFromDetail = React.useCallback((c: Client) => {
    setDetailTarget(null);
    setDepositTarget(c);
  }, []);

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
      <Table
        verticalSpacing="sm"
        horizontalSpacing="md"
        className={listPageStyles.table}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th className={listPageStyles.headCell} miw={220}>Клиенты</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={160}>Телефон</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={110}>Пол</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={140}>Депозит</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={130}>Дата рождения</Table.Th>
            <Table.Th className={listPageStyles.headCell} w={48} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedItems.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text size="sm" c="dimmed" ta="center" py="xl">
                  Клиенты не найдены
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            paginatedItems.map((client) => (
              <Table.Tr
                key={client.id}
                className={`${listPageStyles.row} ${!showArchived ? listPageStyles.rowClickable : ''}`}
                onClick={!showArchived ? () => setDetailTarget(client) : undefined}
              >
                <Table.Td className={listPageStyles.bodyCell}>
                  <Group gap={8} wrap="nowrap" maw="100%">
                    <Avatar radius="md" size={32} color="sage" style={{ flex: '0 0 auto' }}>
                      {getClientInitials(client)}
                    </Avatar>
                    <Box style={{ minWidth: 0, flex: 1 }}>
                      <Text size="sm" fw={400} lh="24px" c="#484848" lineClamp={1}>
                        {getClientFullName(client)}
                      </Text>
                      <Text size="xs" lh="12px" c="rgba(72,72,72,0.4)">
                        Клиент
                      </Text>
                    </Box>
                  </Group>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                    {client.phone ?? '—'}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                    {SEX_LABELS[client.sex]}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={600} c="#484848">
                    {formatPrice(client.deposit)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                    {formatDate(client.birth_date)}
                  </Text>
                </Table.Td>
                <Table.Td className={listPageStyles.bodyCell}>
                  {hasPermission(PermissionCode.CLIENT_MANAGE) && (
                    showArchived ? (
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        aria-label="Восстановить"
                        onClick={(e) => {
                          e.stopPropagation();
                          restoreClient.mutate(client.id);
                        }}
                      >
                        <ArrowCounterClockwiseIcon size={18} />
                      </ActionIcon>
                    ) : (
                      <ActionIcon
                        variant="subtle"
                        color="orange"
                        size="sm"
                        aria-label="Архивировать"
                        onClick={(e) => {
                          e.stopPropagation();
                          setArchiveTargetId(client.id);
                        }}
                      >
                        <ArchiveIcon size={18} />
                      </ActionIcon>
                    )
                  )}
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      <ClientFormModal
        opened={formOpen}
        client={liveEditing}
        onClose={() => setFormOpen(false)}
      />
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
        onConfirm={() =>
          archiveTarget &&
          archiveClient.mutate(archiveTarget.id, {
            onSuccess: () => setArchiveTargetId(null),
          })
        }
        onClose={() => setArchiveTargetId(null)}
      />
    </ListPageShell>
  );
};
