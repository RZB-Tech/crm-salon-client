import React from 'react';
import { ActionIcon, Alert, Avatar, Button, Group, Menu, Skeleton, Table, Text, TextInput } from '@mantine/core';
import { CalendarBlank, DotsThree, MagnifyingGlass, PencilSimple, Plus, Trash } from '@phosphor-icons/react';
import { useClients, useDeleteClient } from '@/shared/api/hooks/useClients';
import type { Client } from '@/shared/api/types';
import { ConfirmModal, DataTable, DataTableRow, ListPage, Pagination } from '@/shared/ui';
import { usePagination } from '@/shared/lib/hooks/usePagination';
import { formatDate, formatPrice, getClientFullName, getClientInitials, SEX_LABELS } from '@/shared/lib/format';
import { ClientFormModal } from './ClientFormModal';
import { DepositModal } from './DepositModal';
import { ClientDetailModal } from './ClientDetailModal';
import styles from './clients-page.module.css';

export const ClientsPage: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Client | null>(null);
  const [depositTarget, setDepositTarget] = React.useState<Client | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Client | null>(null);
  const [detailTarget, setDetailTarget] = React.useState<Client | null>(null);

  const { data: clients, isLoading, isError } = useClients();
  const deleteClient = useDeleteClient();

  const filtered = React.useMemo(
    () =>
      (clients ?? []).filter((client) => {
        const name = getClientFullName(client).toLowerCase();
        const q = search.toLowerCase();
        return !q || name.includes(q) || (client.phone ?? '').includes(q);
      }),
    [clients, search],
  );

  const { page, pageSize, paginatedItems, total, setPage, setPageSize, resetPage } = usePagination(filtered);

  React.useEffect(() => { resetPage(); }, [search, resetPage]);

  const openCreate = React.useCallback(() => { setEditing(null); setFormOpen(true); }, []);
  const openEdit = React.useCallback((c: Client) => { setEditing(c); setFormOpen(true); }, []);

  if (isLoading) {
    return <ListPage title="Клиенты"><Skeleton height={48} /><Skeleton height={400} radius="lg" /></ListPage>;
  }

  if (isError) {
    return <ListPage title="Клиенты"><Alert color="red" title="Не удалось загрузить клиентов">Проверьте доступность API и авторизацию</Alert></ListPage>;
  }

  return (
    <ListPage
      title="Клиенты"
      subtitle={`${filtered.length} клиентов`}
      actions={
        <Group gap="sm">
          <TextInput placeholder="Поиск по имени, телефону..." leftSection={<MagnifyingGlass size={15} />} value={search} onChange={(e) => setSearch(e.currentTarget.value)} size="sm" className={styles.searchInput} />
          <Button leftSection={<Plus size={16} />} onClick={openCreate}>Добавить клиента</Button>
        </Group>
      }
    >
      <DataTable
        columns={[
          { key: 'client', label: 'Клиент' },
          { key: 'phone', label: 'Телефон' },
          { key: 'sex', label: 'Пол' },
          { key: 'deposit', label: 'Депозит' },
          { key: 'birth', label: 'Дата рождения' },
          { key: 'actions', label: '', width: 48 },
        ]}
        isEmpty={filtered.length === 0}
        emptyMessage="Клиенты не найдены"
      >
        {paginatedItems.map((client) => (
          <DataTableRow key={client.id}>
            <Table.Td>
              <Group gap={10}>
                <Avatar radius="md" size="sm" color="sage">{getClientInitials(client)}</Avatar>
                <Text size="sm" fw={600}>{getClientFullName(client)}</Text>
              </Group>
            </Table.Td>
            <Table.Td><Text size="sm" c="dimmed">{client.phone ?? '—'}</Text></Table.Td>
            <Table.Td><Text size="sm">{SEX_LABELS[client.sex]}</Text></Table.Td>
            <Table.Td><Text size="sm" fw={600}>{formatPrice(client.deposit)}</Text></Table.Td>
            <Table.Td><Text size="sm" c="dimmed">{formatDate(client.birth_date)}</Text></Table.Td>
            <Table.Td>
              <Menu shadow="sm" width={180} radius="md">
                <Menu.Target><ActionIcon variant="subtle" color="gray" size="sm"><DotsThree size={16} weight="bold" /></ActionIcon></Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item leftSection={<CalendarBlank size={14} />} onClick={() => setDetailTarget(client)}>Записи и история</Menu.Item>
                  <Menu.Item leftSection={<PencilSimple size={14} />} onClick={() => openEdit(client)}>Редактировать</Menu.Item>
                  <Menu.Item onClick={() => setDepositTarget(client)}>Депозит</Menu.Item>
                  <Menu.Item leftSection={<Trash size={14} />} color="red" onClick={() => setDeleteTarget(client)}>Удалить</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Table.Td>
          </DataTableRow>
        ))}
      </DataTable>

      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} onPageSizeChange={setPageSize} />

      <ClientFormModal opened={formOpen} client={editing} onClose={() => setFormOpen(false)} />
      <DepositModal client={depositTarget} onClose={() => setDepositTarget(null)} />
      <ClientDetailModal client={detailTarget} onClose={() => setDetailTarget(null)} />
      <ConfirmModal opened={Boolean(deleteTarget)} title="Удалить клиента" message={`Удалить ${deleteTarget ? getClientFullName(deleteTarget) : ''}?`} loading={deleteClient.isPending} onConfirm={() => deleteTarget && deleteClient.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })} onClose={() => setDeleteTarget(null)} />
    </ListPage>
  );
};
