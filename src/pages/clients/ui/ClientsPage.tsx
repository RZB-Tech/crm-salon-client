import React from 'react';
import {
  Group,
  Text,
  TextInput,
  Button,
  Avatar,
  Card,
  Table,
  ActionIcon,
  Menu,
  Modal,
  Select,
  Textarea,
  Skeleton,
  Alert,
} from '@mantine/core';
import { MagnifyingGlass, Plus, DotsThree, PencilSimple, Trash } from '@phosphor-icons/react';
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from '@/shared/api/hooks/useClients';
import type { Client, CreateClientPayload, PatchedClient, Sex } from '@/shared/api/types';
import { ConfirmModal } from '@/shared/ui/ConfirmModal';
import {
  getClientFullName,
  getClientInitials,
  getEmployeeColor,
  SEX_LABELS,
  SEX_OPTIONS,
} from '@/shared/lib/format';
import styles from './clients-page.module.css';

interface ClientFormState {
  firstname: string;
  lastname: string;
  middlename: string;
  sex: Sex;
  phone: string;
  email: string;
  birthDate: string;
  city: string;
  notes: string;
}

const emptyForm = (): ClientFormState => ({
  firstname: '',
  lastname: '',
  middlename: '',
  sex: 'female',
  phone: '',
  email: '',
  birthDate: new Date().toISOString().slice(0, 10),
  city: '',
  notes: '',
});

const clientToForm = (client: Client): ClientFormState => ({
  firstname: client.firstname,
  lastname: client.lastname ?? '',
  middlename: client.middlename ?? '',
  sex: client.sex,
  phone: client.phone ?? '',
  email: client.email ?? '',
  birthDate: client.birthDate,
  city: client.city ?? '',
  notes: client.notes ?? '',
});

const formToPayload = (form: ClientFormState): CreateClientPayload => ({
  firstname: form.firstname,
  lastname: form.lastname || null,
  middlename: form.middlename || null,
  sex: form.sex,
  phone: form.phone || null,
  email: form.email || null,
  birthDate: form.birthDate,
  city: form.city || null,
  notes: form.notes,
});

export const ClientsPage: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Client | null>(null);
  const [form, setForm] = React.useState<ClientFormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = React.useState<Client | null>(null);

  const { data: clients, isLoading, isError } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const openCreate = React.useCallback(() => {
    setEditing(null);
    setForm(emptyForm());
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((client: Client) => {
    setEditing(client);
    setForm(clientToForm(client));
    setFormOpen(true);
  }, []);

  const closeForm = React.useCallback(() => {
    setFormOpen(false);
    setEditing(null);
  }, []);

  const handleSubmit = React.useCallback(() => {
    const payload = formToPayload(form);
    if (editing) {
      updateClient.mutate({ id: editing.id, payload: payload as PatchedClient }, { onSuccess: closeForm });
    } else {
      createClient.mutate(payload, { onSuccess: closeForm });
    }
  }, [form, editing, createClient, updateClient, closeForm]);

  const handleDelete = React.useCallback(() => {
    if (!deleteTarget) return;
    deleteClient.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  }, [deleteTarget, deleteClient]);

  const filtered = React.useMemo(() => {
    return (clients ?? []).filter((client) => {
      const name = getClientFullName(client).toLowerCase();
      const q = search.toLowerCase();
      return !q || name.includes(q) || (client.phone ?? '').includes(q) || (client.email ?? '').includes(q);
    });
  }, [clients, search]);

  const isSaving = createClient.isPending || updateClient.isPending;

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Skeleton height={48} />
        <Skeleton height={400} radius="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <Alert color="red" title="Не удалось загрузить клиентов">
          Проверьте доступность API
        </Alert>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <Text size="xl" fw={700}>Клиенты</Text>
          <Text size="sm" c="dimmed" mt={2}>{filtered.length} клиентов</Text>
        </div>
        <Button leftSection={<Plus size={16} />} onClick={openCreate}>Добавить клиента</Button>
      </div>

      <Group gap="sm" className={styles.filters}>
        <TextInput
          placeholder="Поиск по имени, телефону, email..."
          leftSection={<MagnifyingGlass size={15} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          className={styles.searchInput}
          size="sm"
        />
      </Group>

      <Card padding={0} radius="lg" shadow="xs" className={styles.tableCard}>
        <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="lg">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Клиент</Table.Th>
              <Table.Th>Телефон</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Пол</Table.Th>
              <Table.Th>Город</Table.Th>
              <Table.Th>Дата рождения</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Text c="dimmed" ta="center" py="md">Клиенты не найдены</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filtered.map((client) => {
                const color = getEmployeeColor(client.id);
                return (
                  <Table.Tr key={client.id} className={styles.tableRow}>
                    <Table.Td>
                      <Group gap={10}>
                        <Avatar size="sm" radius="md" style={{ backgroundColor: color }}>
                          <Text size="xs" fw={700} c="white">{getClientInitials(client)}</Text>
                        </Avatar>
                        <Text size="sm" fw={600}>{getClientFullName(client)}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td><Text size="sm" c="dimmed">{client.phone ?? '—'}</Text></Table.Td>
                    <Table.Td><Text size="sm" c="dimmed">{client.email ?? '—'}</Text></Table.Td>
                    <Table.Td><Text size="sm">{SEX_LABELS[client.sex]}</Text></Table.Td>
                    <Table.Td><Text size="sm" c="dimmed">{client.city ?? '—'}</Text></Table.Td>
                    <Table.Td><Text size="sm" c="dimmed">{client.birthDate}</Text></Table.Td>
                    <Table.Td>
                      <Menu shadow="sm" width={160} radius="md">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray" size="sm">
                            <DotsThree size={16} weight="bold" />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<PencilSimple size={14} />} onClick={() => openEdit(client)}>
                            Редактировать
                          </Menu.Item>
                          <Menu.Item leftSection={<Trash size={14} />} color="red" onClick={() => setDeleteTarget(client)}>
                            Удалить
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                );
              })
            )}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal
        opened={formOpen}
        onClose={closeForm}
        title={editing ? 'Редактировать клиента' : 'Новый клиент'}
        radius="md"
        size="lg"
      >
        <Group grow mb="md">
          <TextInput label="Имя" required value={form.firstname} onChange={(e) => setForm({ ...form, firstname: e.currentTarget.value })} />
          <TextInput label="Фамилия" value={form.lastname} onChange={(e) => setForm({ ...form, lastname: e.currentTarget.value })} />
        </Group>
        <Group grow mb="md">
          <TextInput label="Отчество" value={form.middlename} onChange={(e) => setForm({ ...form, middlename: e.currentTarget.value })} />
          <Select label="Пол" required data={[...SEX_OPTIONS]} value={form.sex} onChange={(v) => setForm({ ...form, sex: (v as Sex) ?? 'female' })} />
        </Group>
        <Group grow mb="md">
          <TextInput label="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.currentTarget.value })} />
          <TextInput label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.currentTarget.value })} />
        </Group>
        <Group grow mb="md">
          <TextInput label="Дата рождения" type="date" required value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.currentTarget.value })} />
          <TextInput label="Город" value={form.city} onChange={(e) => setForm({ ...form, city: e.currentTarget.value })} />
        </Group>
        <Textarea label="Заметки" mb="lg" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.currentTarget.value })} />
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={closeForm}>Отмена</Button>
          <Button onClick={handleSubmit} loading={isSaving} disabled={!form.firstname || !form.birthDate}>
            {editing ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </Modal>

      <ConfirmModal
        opened={Boolean(deleteTarget)}
        title="Удалить клиента"
        message={`Удалить ${deleteTarget ? getClientFullName(deleteTarget) : ''}?`}
        loading={deleteClient.isPending}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
