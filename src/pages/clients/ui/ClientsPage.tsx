import React from 'react';
import {
  ActionIcon,
  Alert,
  Avatar,
  Box,
  Button,
  Group,
  Menu,
  Pagination as MantinePagination,
  SegmentedControl,
  Select,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import {
  ArchiveIcon,
  ArrowCounterClockwiseIcon,
  CalendarBlankIcon,
  DotsThreeVerticalIcon,
  MagnifyingGlassIcon,
  PencilSimpleIcon,
  PlusIcon,
} from '@phosphor-icons/react';
import { useClients, useArchiveClient, useRestoreClient } from '@/shared/api/hooks/useClients';
import type { Client } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui';
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
import { ClientDetailModal } from './ClientDetailModal';
import styles from './clients-page.module.css';

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
];

export const ClientsPage: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [showArchived, setShowArchived] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Client | null>(null);
  const [depositTarget, setDepositTarget] = React.useState<Client | null>(null);
  const [archiveTarget, setArchiveTarget] = React.useState<Client | null>(null);
  const [detailTarget, setDetailTarget] = React.useState<Client | null>(null);

  const { data: clients, isLoading, isError } = useClients(showArchived);
  const archiveClient = useArchiveClient();
  const restoreClient = useRestoreClient();

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

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

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

  if (isLoading) {
    return (
      <Box className={styles.page}>
        <Box className={styles.toolbar}>
          <Skeleton height={32} width={240} radius="md" />
          <Skeleton height={32} width={160} radius="md" />
        </Box>
        <Stack gap="xs" p="md">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} height={48} radius="sm" />
          ))}
        </Stack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className={styles.page}>
        <Box p="xl">
          <Alert color="red" title="Не удалось загрузить клиентов">
            Проверьте доступность API и авторизацию
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.page}>
      <Box className={styles.toolbar}>
        <Group gap={8}>
          <SegmentedControl
            value={showArchived ? 'archived' : 'active'}
            onChange={(v) => setShowArchived(v === 'archived')}
            data={[
              { value: 'active', label: 'Активные' },
              { value: 'archived', label: 'Архив' },
            ]}
            size="xs"
            radius="sm"
          />
          <TextInput
            placeholder="Поиск по имени, телефону..."
            leftSection={<MagnifyingGlassIcon size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            size="sm"
            className={styles.searchInput}
          />
        </Group>
        {!showArchived && (
          <Button
            color="sage.7"
            rightSection={<PlusIcon size={16} />}
            onClick={openCreate}
            size="sm"
          >
            Добавить клиента
          </Button>
        )}
      </Box>

      <Box className={styles.tableWrapper}>
        <Table
          verticalSpacing="sm"
          horizontalSpacing="md"
          className={styles.table}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th className={styles.headCell}>Клиенты</Table.Th>
              <Table.Th className={styles.headCell} w={380}>Телефон</Table.Th>
              <Table.Th className={styles.headCell} w={275}>Пол</Table.Th>
              <Table.Th className={styles.headCell} w={310}>Депозит</Table.Th>
              <Table.Th className={styles.headCell} w={240}>Дата рождения</Table.Th>
              <Table.Th className={styles.headCell} w={48} />
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
                <Table.Tr key={client.id} className={styles.row}>
                  <Table.Td className={styles.bodyCell}>
                    <Group gap={8} wrap="nowrap">
                      <Avatar radius="md" size={32} color="sage">
                        {getClientInitials(client)}
                      </Avatar>
                      <Box>
                        <Text size="sm" fw={400} lh="24px" c="#484848">
                          {getClientFullName(client)}
                        </Text>
                        <Text size="xs" lh="12px" c="rgba(72,72,72,0.4)">
                          Клиент
                        </Text>
                      </Box>
                    </Group>
                  </Table.Td>
                  <Table.Td className={styles.bodyCell}>
                    <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                      {client.phone ?? '—'}
                    </Text>
                  </Table.Td>
                  <Table.Td className={styles.bodyCell}>
                    <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                      {SEX_LABELS[client.sex]}
                    </Text>
                  </Table.Td>
                  <Table.Td className={styles.bodyCell}>
                    <Text size="sm" fw={600} c="#484848">
                      {formatPrice(client.deposit)}
                    </Text>
                  </Table.Td>
                  <Table.Td className={styles.bodyCell}>
                    <Text size="sm" fw={500} c="rgba(72,72,72,0.4)">
                      {formatDate(client.birth_date)}
                    </Text>
                  </Table.Td>
                  <Table.Td className={styles.bodyCell}>
                    <Menu shadow="sm" width={180} radius="md">
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray" size="sm">
                          <DotsThreeVerticalIcon size={20} weight="bold" />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {showArchived ? (
                          <Menu.Item
                            leftSection={<ArrowCounterClockwiseIcon size={14} />}
                            onClick={() => restoreClient.mutate(client.id)}
                          >
                            Восстановить
                          </Menu.Item>
                        ) : (
                          <>
                            <Menu.Item
                              leftSection={<CalendarBlankIcon size={14} />}
                              onClick={() => setDetailTarget(client)}
                            >
                              Записи и история
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<PencilSimpleIcon size={14} />}
                              onClick={() => openEdit(client)}
                            >
                              Редактировать
                            </Menu.Item>
                            <Menu.Item onClick={() => setDepositTarget(client)}>
                              Депозит
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<ArchiveIcon size={14} />}
                              color="orange"
                              onClick={() => setArchiveTarget(client)}
                            >
                              Архивировать
                            </Menu.Item>
                          </>
                        )}
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Box>

      <Box className={styles.pagination}>
        <Box className={styles.paginationMeta}>
          <Group gap={8}>
            <Text size="sm" fw={500} c="#484848">
              Показать:
            </Text>
            <Select
              size="xs"
              w={64}
              data={PAGE_SIZE_OPTIONS}
              value={String(pageSize)}
              onChange={(value) => {
                if (value) setPageSize(Number(value));
              }}
              allowDeselect={false}
            />
          </Group>
          <Text size="sm" c="#484848">
            {from}–{to} из {total}
          </Text>
        </Box>

        <MantinePagination
          value={page}
          onChange={setPage}
          total={totalPages}
          size="lg"
          radius="sm"
        />
      </Box>

      <ClientFormModal
        opened={formOpen}
        client={editing}
        onClose={() => setFormOpen(false)}
      />
      <DepositModal client={depositTarget} onClose={() => setDepositTarget(null)} />
      <ClientDetailModal
        client={detailTarget}
        onClose={() => setDetailTarget(null)}
      />
      <ConfirmModal
        opened={Boolean(archiveTarget)}
        title="Архивировать клиента"
        message={`Архивировать ${archiveTarget ? getClientFullName(archiveTarget) : ''}? Клиент будет скрыт из списка.`}
        loading={archiveClient.isPending}
        onConfirm={() =>
          archiveTarget &&
          archiveClient.mutate(archiveTarget.id, {
            onSuccess: () => setArchiveTarget(null),
          })
        }
        onClose={() => setArchiveTarget(null)}
      />
    </Box>
  );
};
