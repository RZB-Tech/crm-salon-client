import React from 'react';
import { Button, Group, Modal, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useCreateClient, useUpdateClient } from '@/shared/api/hooks/useClients';
import type { Client, ClientCreatePayload, ClientUpdatePayload, Sex } from '@/shared/api/types';
import { SEX_OPTIONS } from '@/shared/lib/format';

interface ClientFormState {
  firstname: string;
  lastname: string;
  middlename: string;
  sex: Sex;
  phone: string;
  birth_date: string;
  deposit: number;
  notes: string;
}

const emptyForm = (): ClientFormState => ({
  firstname: '', lastname: '', middlename: '', sex: 'female', phone: '', birth_date: '', deposit: 0, notes: '',
});

const clientToForm = (client: Client): ClientFormState => ({
  firstname: client.firstname,
  lastname: client.lastname ?? '',
  middlename: client.middlename ?? '',
  sex: client.sex,
  phone: client.phone ?? '',
  birth_date: client.birth_date ?? '',
  deposit: client.deposit,
  notes: client.notes ?? '',
});

const formToPayload = (form: ClientFormState): ClientCreatePayload => ({
  firstname: form.firstname,
  lastname: form.lastname || null,
  middlename: form.middlename || null,
  sex: form.sex,
  phone: form.phone || null,
  birth_date: form.birth_date || null,
  deposit: form.deposit,
  notes: form.notes || null,
});

interface ClientFormModalProps {
  opened: boolean;
  client: Client | null;
  onClose: () => void;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({ opened, client, onClose }) => {
  const [form, setForm] = React.useState<ClientFormState>(emptyForm);
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  React.useEffect(() => {
    if (!opened) return;
    setForm(client ? clientToForm(client) : emptyForm());
  }, [opened, client]);

  const handleSubmit = React.useCallback(() => {
    if (client) {
      const payload: ClientUpdatePayload = { id: client.id, ...formToPayload(form) };
      updateClient.mutate(payload, { onSuccess: onClose });
    } else {
      createClient.mutate(formToPayload(form), { onSuccess: onClose });
    }
  }, [form, client, createClient, updateClient, onClose]);

  const isSaving = createClient.isPending || updateClient.isPending;

  return (
    <Modal opened={opened} onClose={onClose} title={client ? 'Редактировать клиента' : 'Новый клиент'} radius="md" size="lg">
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
        <TextInput label="Дата рождения" type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.currentTarget.value })} />
      </Group>
      {!client && (
        <NumberInput label="Начальный депозит" mb="md" min={0} value={form.deposit} onChange={(v) => setForm({ ...form, deposit: Number(v) || 0 })} />
      )}
      <Textarea label="Заметки" mb="lg" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.currentTarget.value })} />
      <Group justify="flex-end">
        <Button variant="subtle" color="gray" onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} loading={isSaving} disabled={!form.firstname}>{client ? 'Сохранить' : 'Создать'}</Button>
      </Group>
    </Modal>
  );
};
